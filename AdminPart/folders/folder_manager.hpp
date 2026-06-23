#pragma once


#include <string>
#include <vector>
#include <map>
#include <cstdint>
#include <filesystem>
#include <fstream>
#include <nlohmann/json.hpp>


class folder_manager {
	static inline std::string path() {
		return "storage/folders";
	}


	static inline std::string order_path(const std::string& folder) {
		return path() + '/' + folder + ".order";
	}


public:
	static std::vector<std::string> read_order(const std::string& folder) {
		std::vector<std::string> names;
		std::string pth = order_path(folder);

		if (!std::filesystem::exists(pth))
			return names;

		try {
			std::ifstream file{ pth };
			nlohmann::json js = nlohmann::json::parse(file);

			if (js.is_array()) {
				for (const auto& el : js) {
					if (el.is_string())
						names.push_back(el.get<std::string>());
				}
			}
		}
		catch (...) {}

		return names;
	}


	static bool save_order(const std::string& folder, const std::vector<std::string>& names) noexcept {
		try {
			nlohmann::json arr = names;

			std::ofstream file{ order_path(folder) };
			file << arr.dump();

			return true;
		}
		catch (...) {
			return false;
		}
	}


	static bool delete_file(const std::string& folder, std::string&& attachment) {
		std::string pth = path() + '/' + folder;

		auto dir = std::filesystem::directory_iterator(pth);
		for (const auto& entry : dir) {
			if (!entry.is_directory()) {
				std::filesystem::path entry_path = entry.path();
				if (entry_path.stem().string() == attachment) {
					std::filesystem::remove(entry_path);

					return true;
				}
			}
		}

		return false;
	}


	static bool add_file(const std::string& folder, std::string&& attachment, std::string&& extension, std::vector<char>&& data) noexcept {
		std::string pth = path() + '/' + folder + '/' + attachment + extension;

		try {
			delete_file(folder, std::move(attachment));

			std::ofstream file{ pth, std::ios::binary };
			file.write(reinterpret_cast<const char*>(data.data()), data.size());

			return true;
		}
		catch (...) {
			return false;
		}
	}


	static std::filesystem::path get_file(const std::string& folder, std::string&& attachment) {
		std::string pth = path() + '/' + folder;

		auto dir = std::filesystem::directory_iterator(pth);
		for (const auto& entry : dir) {
			if (!entry.is_directory()) {
				std::filesystem::path entry_path = entry.path();
				
				if (entry_path.filename().stem().string() == attachment) return entry_path;
			}
		}

		return std::filesystem::path();
	}


	static nlohmann::json get_files(const std::string& folder) {
		std::string pth = path() + '/' + folder;

		std::map<std::string, std::uintmax_t> sizes;
		for (const auto& entry : std::filesystem::directory_iterator(pth)) {
			if (!entry.is_directory())
				sizes[entry.path().filename().string()] = entry.file_size();
		}

		nlohmann::json arr = nlohmann::json::array();

		for (const auto& name : read_order(folder)) {
			auto it = sizes.find(name);
			if (it != sizes.end()) {
				nlohmann::json js;
				js["name"] = it->first;
				js["size"] = it->second;

				arr.push_back(js);
				sizes.erase(it);
			}
		}

		for (const auto& entry : sizes) {
			nlohmann::json js;
			js["name"] = entry.first;
			js["size"] = entry.second;

			arr.push_back(js);
		}

		return arr;
	}
};