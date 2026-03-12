#include "fals/main_server.hpp"
#include <nlohmann/json.hpp>
#include <iostream>

#include "admin/admin.hpp"


int main( ) {
    MainServer serv { 8080, 4 };
    if ( !std::filesystem::exists("storage") )
        std::filesystem::create_directories("storage");


    Block team {
        "\u043A\u043E\u043C\u0430\u043D\u0434\u0430",
        {
            { "fullname", types::STR, "\u0424\u0418\u041E" },
            { "post", types::STR, "\u0414\u043E\u043B\u0436\u043D\u043E\u0441\u0442\u044C" },
            { "number", types::STR, "\u0422\u0435\u043B\u0435\u0444\u043E\u043D" },
            { "email", types::STR, "\u041F\u043E\u0447\u0442\u0430" }
        },
        {
            { "photo", "image/png", "\u0424\u043E\u0442\u043E" }
        }
    };


    Block metro {
        "\u043C\u0435\u0442\u0440\u043E",
        {
            { "name", types::STR, "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435" },
            { "short_desc", types::STR, "\u041A\u0440\u0430\u0442\u043A\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" },

            { "full_desc_one", types::STR, "\u041F\u043E\u043B\u043D\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" },
            { "full_desc_two", types::STR, "\u0414\u043E\u043F. \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" },

            { "scheme_desc", types::STR, "\u0421\u0445\u0435\u043C\u0430" },

            { "modern_desc", types::STR, "\u041C\u043E\u0434\u0435\u0440\u043D\u0438\u0437\u0430\u0446\u0438\u044F" },

            { "struct_desc", types::STR, "\u0418\u043D\u0444\u0440\u0430\u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0430" },

            { "partnership_desc", types::STR, "\u041F\u0430\u0440\u0442\u043D\u0435\u0440\u0441\u0442\u0432\u043E" },

            { "safety_desc", types::STR, "\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C" },

            { "acessable_desc", types::STR, "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u044C" }
        },
        {
            { "logo", "image/svg+xml", "\u041B\u043E\u0433\u043E\u0442\u0438\u043F" },

            { "desc_one", "image/png", "\u041F\u043E\u043B\u043D\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" },

            { "desc_two", "image/png", "\u0414\u043E\u043F. \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" },

            { "scheme", "image/png", "\u0421\u0445\u0435\u043C\u0430" },

            { "modern", "image/png", "\u041C\u043E\u0434\u0435\u0440\u043D\u0438\u0437\u0430\u0446\u0438\u044F" },

            { "struct", "image/png", "\u0418\u043D\u0444\u0440\u0430\u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0430" },

            { "partnership", "image/png", "\u041F\u0430\u0440\u0442\u043D\u0435\u0440\u0441\u0442\u0432\u043E" },
        }
    };

    
    Block friendly {
        "\u043F\u0440\u0435\u0434\u043F\u0440\u0438\u044F\u0442\u0438\u044F",
        {
            { "name", types::STR, "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435" },
            { "short_desc", types::STR, "\u041A\u0440\u0430\u0442\u043A\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" },

            { "full_desc_one", types::STR, "\u041F\u043E\u043B\u043D\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" },
            { "full_desc_two", types::STR, "\u0414\u043E\u043F. \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" },

            { "spec_desc", types::STR, "\u0421\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F" },

            { "quality", types::STR, "\u043A\u0430\u0447\u0435\u0441\u0442\u0432\u043E" },

            { "contact", types::STR, "\u043A\u043E\u043D\u0442\u0430\u043A\u0442\u044B" }
    },
        {
            { "logo", "image/svg+xml", "\u041B\u043E\u0433\u043E\u0442\u0438\u043F" },

            { "desc_one", "image/png", "\u041F\u043E\u043B\u043D\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" },

            { "desc_two", "image/png", "\u0414\u043E\u043F. \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" },

            { "spec", "image/png", "\u041F\u043E\u043B\u043D\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" }
        }
    };


    Block news {
        "\u043D\u043E\u0432\u043E\u0441\u0442\u0438",
        {
            { "header", types::STR, "\u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A" },
            { "body", types::STR, "\u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435" },
            { "date", types::DATE, "\u0434\u0430\u0442\u0430" }
    },
        {
            { "mini", "image/png", "\u043F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440" },
            { "full", "image/png", "\u043F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435" },
        }
    };


    Block events {
        "\u043C\u0435\u0440\u043E\u043F\u0440\u0438\u044F\u0442\u0438\u044F",
        {
            { "header", types::STR, "\u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A" },
            { "body", types::STR, "\u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435" },
            { "date", types::DATE_TIME, "\u0432\u0440\u0435\u043C\u044F" }
        },
        {

        }
    };


    
    serv.add_callback({ "GET", { "api", "v1", "content" }, [](std::shared_ptr<server_request> request) {
        auto response = fals_CMS::handle_get(request);
        return response;
    } });


    serv.add_callback({ "POST", { "api", "v1", "content" }, [](std::shared_ptr<server_request> request) {
        auto response = fals_CMS::handle_post(request);
        return response;
    } });


    serv.add_callback({ "OPTIONS", { "api", "v1", "content" }, [](std::shared_ptr<server_request> request) {
        auto response = std::make_shared<text_response>(request->socket, 200, "OK", "text/plain", "");

        response->headers ["Access-Control-Allow-Origin"] = "*";
        response->headers ["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
        response->headers ["Access-Control-Allow-Headers"] = "Content-Type";
        response->headers ["Access-Control-Max-Age"] = "86400";

        return response;
    } });


    serv.add_callback({ "GET", { "" }, [](std::shared_ptr<server_request> request) {
        return std::make_shared<file_response>(request->socket, 200, "OK", "text/html", "logon.html", "logon.html", OpenType::INLINE);
    } });


    serv.add_callback({ "GET", { "admin" }, [](std::shared_ptr<server_request> request) {
        if (request->query.contains ( "secret" ) && request->query ["secret"] == secret)
            return std::make_shared<file_response>(request->socket, 200, "OK", "text/html", "admin.html", "admin.html", OpenType::INLINE);

        return std::make_shared<file_response> ( );
    } });


    std::cout << "Server running. Press Enter to stop...\n";

    if ( false ) {
        std::cin.get( );
    }
    else {
        while ( true )
            continue;
    }

    return 0;
}
