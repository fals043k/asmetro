#pragma once


#include <unordered_map>
#include <string>
#include <typeindex>
#include <fstream>
#include <nlohmann/json.hpp>
#include "../fals/main_server.hpp"
#include <filesystem>


std::string secret = "default-secret-key";


enum class types {
	STR, DATE, TIME, DATE_TIME, INT, BOOL, LIST
};

const std::unordered_map<types, std::string> JSON_MAP {
	{ types::STR, "str" },
	{ types::DATE, "date" },
	{ types::TIME, "time" },
	{ types::DATE_TIME, "date-time" },
	{ types::INT, "int" },
	{ types::BOOL, "bool" },
	{ types::LIST, "list" }
};


const std::unordered_map<std::string, std::string> ATTACHMENT_MAPPING = {
	// Text
	{ "text/plain", ".txt" },
	{ "text/html", ".html" },
	{ "text/css", ".css" },
	{ "text/csv", ".csv" },
	{ "text/javascript", ".js" },
	{ "text/markdown", ".md" },
	{ "text/calendar", ".ics" },

	// Images
	{ "image/jpeg", ".jpg" },
	{ "image/png", ".png" },
	{ "image/gif", ".gif" },
	{ "image/webp", ".webp" },
	{ "image/svg+xml", ".svg" },
	{ "image/bmp", ".bmp" },
	{ "image/tiff", ".tiff" },
	{ "image/avif", ".avif" },
	{ "image/apng", ".apng" },
	{ "image/vnd.microsoft.icon", ".ico" },

	// Audio
	{ "audio/mpeg", ".mp3" },
	{ "audio/ogg", ".ogg" },
	{ "audio/wav", ".wav" },
	{ "audio/webm", ".weba" },
	{ "audio/aac", ".aac" },
	{ "audio/midi", ".midi" },

	// Video
	{ "video/mp4", ".mp4" },
	{ "video/mpeg", ".mpeg" },
	{ "video/webm", ".webm" },
	{ "video/ogg", ".ogv" },
	{ "video/x-msvideo", ".avi" },
	{ "video/3gpp", ".3gp" },
	{ "video/3gpp2", ".3g2" },
	{ "video/mp2t", ".ts" },

	// Documents
	{ "application/pdf", ".pdf" },
	{ "application/msword", ".doc" },
	{ "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx" },
	{ "application/vnd.ms-excel", ".xls" },
	{ "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".xlsx" },
	{ "application/vnd.ms-powerpoint", ".ppt" },
	{ "application/vnd.openxmlformats-officedocument.presentationml.presentation", ".pptx" },
	{ "application/rtf", ".rtf" },
	{ "application/vnd.oasis.opendocument.text", ".odt" },
	{ "application/vnd.oasis.opendocument.spreadsheet", ".ods" },
	{ "application/vnd.oasis.opendocument.presentation", ".odp" },
	{ "application/epub+zip", ".epub" },

	// Archives
	{ "application/zip", ".zip" },
	{ "application/x-zip-compressed", ".zip" },
	{ "application/x-7z-compressed", ".7z" },
	{ "application/x-rar-compressed", ".rar" },
	{ "application/gzip", ".gz" },
	{ "application/x-tar", ".tar" },
	{ "application/x-bzip", ".bz" },
	{ "application/x-bzip2", ".bz2" },

	// Data formats
	{ "application/json", ".json" },
	{ "application/xml", ".xml" },
	{ "application/ld+json", ".jsonld" },
	{ "application/java-archive", ".jar" },
	{ "application/octet-stream", ".bin" },

	// Fonts
	{ "font/ttf", ".ttf" },
	{ "font/otf", ".otf" },
	{ "font/woff", ".woff" },
	{ "font/woff2", ".woff2" },

	// Other
	{ "application/xhtml+xml", ".xhtml" },
	{ "application/x-sh", ".sh" },
	{ "application/x-csh", ".csh" },
	{ "application/x-httpd-php", ".php" },
	{ "application/vnd.amazon.ebook", ".azw" },
	{ "application/x-freearc", ".arc" },
	{ "application/vnd.visio", ".vsd" },
	{ "application/x-abiword", ".abw" }
};




class json_require {
public:

	std::string name_;
	types type_;
	std::string desc_;


	json_require ( std::string &&name, types &&type, std::string &&desc )
		: type_ ( type ), name_ ( name ), desc_ ( desc ) { }
};


class file_require {
public:
	std::string name_;
	std::string type_;
	std::string desc_;
};


class Block {
	std::string get_this_storage ( ) {
		std::string res;
		res += "storage";
		res += '/';
		res += name_;

		return res;
	}

public:
	std::string name_;
	std::vector<json_require> json_requires_;
	std::vector<file_require> file_requires_;


	Block ( std::string &&name, std::vector<json_require> &&json_requires, std::vector<file_require> &&file_requires )
		: name_ ( name ), json_requires_ ( json_requires ), file_requires_ ( file_requires ) {

		if ( !std::filesystem::exists ( "storage/" + name ) )
			std::filesystem::create_directories ( "storage/" + name );

		Block::get_blocks ( ).push_back ( this );
	}



	static std::vector<Block *> &get_blocks ( ) {
		static std::vector<Block * > blocks;

		return blocks;
	}



	/*
	C:\Windows\System32>curl -X GET "localhost:8080/api/v1/content/news/requires":
	[[["test", "str", "test"]], [["test", "text/plain", "test"]] ]

	noexcept
	*/
	std::shared_ptr<server_response> get_requires ( std::shared_ptr<server_request> request ) {
		nlohmann::json res;

		nlohmann::json json = nlohmann::json::array ( );

		for ( json_require j : json_requires_ ) {
			nlohmann::json object = nlohmann::json::array ( );

			object.push_back ( j.name_ );
			object.push_back ( JSON_MAP.at ( j.type_ ) );
			object.push_back ( j.desc_ );

			json.push_back ( object );
		}

		res ["json"] = json;
		json.clear ( );

		for ( file_require f : file_requires_ ) {
			nlohmann::json object = nlohmann::json::array ( );

			object.push_back ( f.name_ );
			object.push_back ( f.type_ );
			object.push_back ( f.desc_ );

			json.push_back ( object );
		}

		res ["attachments"] = json;

		return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", res.dump ( ) );
	}



	/*
	C:\Windows\System32>curl -X POST "localhost:8080/api/v1/content/news/content" -F "name=new" -F "data={\"test\":\"test1\"}":
	{"status":"ok"}

	exception:
	{"status":"bad request"} || {"status":"content aint exists"} || {"status":"bad json"}
	*/
	std::shared_ptr<server_response> set_content ( std::shared_ptr<server_request> request ) {
		auto name = request->get_form_by_key ( "name" );
		if ( name.empty ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad request\"}" );

		auto data = request->get_form_by_key ( "data" );
		if ( data.empty ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad request\"}" );


		std::string path = get_this_storage ( ) + '/' + name.value;
		if ( !std::filesystem::exists ( path ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"content aint exists\"}" );


		nlohmann::json js = nlohmann::json::parse ( data.value );
		if ( js.size ( ) != json_requires_.size ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad json\"}" );

		for ( json_require jr : json_requires_ ) {
			if ( !js.contains ( jr.name_ ) )
				return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad json\"}" );


			const auto &field_value = js [jr.name_];
			bool valid = true;
			switch ( jr.type_ ) {
				case types::STR:
				case types::DATE:
				case types::TIME:
				case types::DATE_TIME:
					valid = field_value.is_string ( );

					break;

				case types::INT:
					valid = field_value.is_number_integer ( );

					break;

				case types::BOOL:
					valid = field_value.is_boolean ( );

					break;

				case types::LIST:
					valid = field_value.is_array ( );

					break;

				default:
					valid = false;

					break;
			}

			if ( !valid )
				return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad json\"}" );
		}


		std::ofstream file { path + '/' + "content.json" };
		if ( !file.is_open ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"content aint exists\"}" );


		file << data.value;
		file.close ( );


		return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"ok\"}" );
	}



	/*
	C:\Windows\System32>curl -X GET "localhost:8080/api/v1/content/news/content?name=new"
	{"test":"test"}

	exception:
	{"status":"bad request"} || {"status":"content aint exists"}
	*/
	std::shared_ptr<server_response> get_content ( std::shared_ptr<server_request> request ) {
		std::string name = request->query.contains ( "name" ) ? request->query ["name"] : "";
		if ( name.empty ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad request\"}" );


		std::string path = get_this_storage ( ) + '/' + name + '/' + "content.json";
		if ( !std::filesystem::exists ( path ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"content aint exists\"}" );


		return std::make_shared<file_response> ( request->socket, 200, "OK", "application/json", path, "content.json", OpenType::INLINE );
	}



	/*
	C:\Windows\System32>curl -X POST "localhost:8080/api/v1/content/news/list" -F "data=[\"test\"]"
	{"status":"ok"}

	exception:
	{"status":"bad request"} || {"status":"content aint exists"}
	*/
	std::shared_ptr<server_response> set_order ( std::shared_ptr<server_request> request ) {
		auto data = request->get_form_by_key ( "data" );
		if ( data.empty ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad request\"}" );


		std::string path = get_this_storage ( );
		if ( !std::filesystem::exists ( path ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"content aint exists\"}" );


		std::ofstream file { path + '/' + "order.json" };
		if ( !file.is_open ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"content aint exists\"}" );


		file << data.value;
		file.close ( );


		return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"ok\"}" );
	}



	/*
	C:\Windows\System32>curl -X GET "localhost:8080/api/v1/content/news/list"
	{"invisible":["new"],"visible":["test"]}

	exception:
	{"status":"content aint exists"}
	*/
	std::shared_ptr<server_response> get_order ( std::shared_ptr<server_request> request ) {
		std::string path = get_this_storage ( );
		if ( !std::filesystem::exists ( path ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"content aint exists\"}" );

		bool moder_view = request->query.contains ( "secret" ) && request->query ["secret"] == secret;

		std::ifstream file { path + '/' + "order.json" };
		nlohmann::json order_data = file.is_open ( ) ? nlohmann::json::parse ( file ) : nlohmann::json::array ( );

		if ( !moder_view ) {
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", order_data.dump ( ) );
		}

		std::vector<std::string> folders;

		for ( const auto &entry : std::filesystem::directory_iterator ( path ) ) {
			std::string filename = entry.path ( ).filename ( ).string ( );
			if ( entry.is_directory ( ) && std::find ( order_data.begin ( ), order_data.end ( ), filename ) == order_data.end ( ) )
				folders.push_back ( filename );
		}


		nlohmann::json res;
		res ["visible"] = order_data;
		res ["invisible"] = folders;


		return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", res.dump ( ) );
	}



	/*
	C:\Windows\System32>curl -X POST "localhost:8080/api/v1/content/news/create" -F "name=test2"
	{"status":"ok"}

	exception:
	{"status":"bad request"} || {"status":"already exists"}
	*/
	std::shared_ptr<server_response> create_object ( std::shared_ptr<server_request> request ) {
		auto name = request->get_form_by_key ( "name" );
		if ( name.empty ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad request\"}" );


		std::string path = get_this_storage ( ) + '/' + name.value;
		if ( std::filesystem::exists ( path ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"already exists\"}" );


		std::filesystem::create_directory ( path );


		return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"ok\"}" );
	}



	/*
	C:\Windows\System32>curl -X POST "localhost:8080/api/v1/content/news/remove" -F "name=test2"
	{"status":"ok"}

	exception:
	{"status":"bad request"} || {"status":"already removed"}
	*/
	std::shared_ptr<server_response> remove_object ( std::shared_ptr<server_request> request ) {
		auto name = request->get_form_by_key ( "name" );
		if ( name.empty ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad request\"}" );


		std::string path = get_this_storage ( ) + '/' + name.value;
		if ( !std::filesystem::exists ( path ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"already removed\"}" );


		std::filesystem::remove_all ( path );


		std::string order = get_this_storage ( ) + '/' + "order.json";
		std::ifstream ofile { order };


		nlohmann::json js = ofile.is_open ( ) ? nlohmann::json::parse ( ofile ) : nlohmann::json::array ( );
		js.erase (
			std::remove ( js.begin ( ), js.end ( ), nlohmann::json ( name.value ) ),
			js.end ( )
		);


		std::ofstream ifile { order };
		if ( !ifile.is_open ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"content aint exists\"}" );


		std::string data = js.dump ( );


		ifile << data;
		ifile.close ( );


		return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"ok\"}" );
	}



	/*
	C:\Windows\System32>curl -X POST "localhost:8080/api/v1/content/news/attach" -F "name=new" -F "attachment=test" -F "file=@C:\\Users\\romap\\Downloads\\file (1).txt"
	{"status":"ok"}

	exception:
	{"status":"bad request"} || {"status":"aint exists"} || {"status":"bad attachment"}
	*/
	std::shared_ptr<server_response> add_attachment ( std::shared_ptr<server_request> request ) {
		auto name = request->get_form_by_key ( "name" );
		if ( name.empty ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad request\"}" );


		auto attachment = request->get_form_by_key ( "attachment" );
		if ( attachment.empty ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad request\"}" );


		if ( request->files.size ( ) != 1 )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad request\"}" );


		auto handle = std::find_if ( file_requires_.begin ( ), file_requires_.end ( ), [&attachment]( const file_require &f ) {
			return f.name_ == attachment.value;
		} );
		if ( handle == file_requires_.end ( ) or handle->type_ != request->files [0].type )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad attachment\"}" );


		std::string path = get_this_storage ( ) + '/' + name.value + '/' + handle->name_ + ATTACHMENT_MAPPING.at ( handle->type_ );


		std::ofstream file { path, std::ios::binary };
		if ( !file.is_open ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"aint exists\"}" );


		file.write ( reinterpret_cast<const char *>( request->files [0].data.data ( ) ), request->files [0].data.size ( ) );


		return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"ok\"}" );
	}



	/*
	C:\Windows\System32>curl -X POST "localhost:8080/api/v1/content/news/detach" -F "name=new" -F "attachment=test"
	{"status":"ok"}

	exception:
	{"status":"bad request"} || {"status":"already removed"} || {"status":"bad attachment"}
	*/
	std::shared_ptr<server_response> remove_attachment ( std::shared_ptr<server_request> request ) {
		auto name = request->get_form_by_key ( "name" );
		if ( name.empty ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad request\"}" );


		auto attachment = request->get_form_by_key ( "attachment" );
		if ( attachment.empty ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad request\"}" );


		auto handle = std::find_if ( file_requires_.begin ( ), file_requires_.end ( ), [&attachment]( const file_require &f ) {
			return f.name_ == attachment.value;
		} );
		if ( handle == file_requires_.end ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad attachment\"}" );


		std::string path = get_this_storage ( ) + '/' + name.value + '/' + handle->name_ + ATTACHMENT_MAPPING.at ( handle->type_ );
		if ( !std::filesystem::exists ( path ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"already removed\"}" );


		std::filesystem::remove ( path );


		return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"ok\"}" );
	}



	/*
	C:\Windows\System32>curl -X GET "localhost:8080/api/v1/content/news/attachment?name=new&attachment=test"
	secret=12345 (inline file input, despite the file type)

	exception:
	{"status":"bad request"} || {"status":"aint exists"} || {"status":"bad attachment"}
	*/
	std::shared_ptr<server_response> get_attachment ( std::shared_ptr<server_request> request ) {
		std::string name = request->query.contains ( "name" ) ? request->query ["name"] : "";
		if ( name.empty ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad request\"}" );


		std::string attachment = request->query.contains ( "attachment" ) ? request->query ["attachment"] : "";
		if ( attachment.empty ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad request\"}" );


		auto handle = std::find_if ( file_requires_.begin ( ), file_requires_.end ( ), [&attachment]( const file_require &f ) {
			return f.name_ == attachment;
		} );
		if ( handle == file_requires_.end ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad attachment\"}" );


		std::string filename = handle->name_ + ATTACHMENT_MAPPING.at ( handle->type_ );
		std::string path = get_this_storage ( ) + '/' + name + '/' + filename;
		if ( !std::filesystem::exists ( path ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"aint exists\"}" );


		return std::make_shared<file_response> ( request->socket, 200, "OK", handle->type_, path, filename, OpenType::INLINE );
	}


	/*
	C:\Windows\System32>curl -X GET "localhost:8080/api/v1/content/news/attachments?name=new"
	["test.txt"]

	exception:
	{"status":"bad request"} || {"status":"aint exists"}
	*/
	std::shared_ptr<server_response> get_attachments ( std::shared_ptr<server_request> request ) {
		std::string name = request->query.contains ( "name" ) ? request->query ["name"] : "";
		if ( name.empty ( ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"bad request\"}" );


		std::string path = get_this_storage ( ) + '/' + name;
		if ( !std::filesystem::exists ( path ) )
			return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"aint exists\"}" );


		nlohmann::json res = nlohmann::json::array ( );

		for ( const auto &entry : std::filesystem::directory_iterator ( path ) ) {
			std::string filename = entry.path ( ).filename ( ).string ( );

			filename = filename.substr ( 0, filename.find_last_of ( '.' ) );

			if ( filename != "content" )
				res.push_back ( filename );
		}


		return std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", res.dump ( ) );
	}
};