#pragma once


#include "../fals/server_request.hpp"
#include "../fals/server_response.hpp"
#include "block.hpp"


class fals_CMS {
public:
        static std::shared_ptr<server_response> handle_get ( std::shared_ptr<server_request> request ) {
                std::shared_ptr<server_response> response;
                
                if ( request->api.size ( ) == 4 && request->api [3] == "list" && request->query.contains ( "secret" ) && request->query ["secret"] == secret ) {
                        std::vector<std::string> names;
                        std::vector<Block *> blocks = Block::get_blocks ( );

                        for ( Block *block : blocks ) names.push_back ( block->name_ );

                        nlohmann::json res = names;

                        response = std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", res.dump ( ) );
                }
                else if ( request->api.size ( ) == 5 ) {
                        std::vector<Block *> blocks = Block::get_blocks ( );

                        auto block_search = std::find_if ( blocks.begin ( ), blocks.end ( ), [&request]( Block *block ) {
                                return block->name_ == request->api [3];
                        } );

                        if ( block_search != blocks.end ( ) ) {
                                Block *block = *block_search;

                                if ( request->api [4] == "content" ) response = block->get_content ( request );
                                else if ( request->api [4] == "requires" ) response = block->get_requires ( request );
                                else if ( request->api [4] == "list" ) response = block->get_order ( request );
                                else if ( request->api [4] == "attachment" ) response = block->get_attachment ( request );
                                else if ( request->api [4] == "attachments" ) response = block->get_attachments ( request );
                        }
                }

                if (!response) {
                        response = std::make_shared<text_response> ( );
                }

                response->headers["Access-Control-Allow-Origin"] = "*";
                response->headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
                response->headers["Access-Control-Allow-Headers"] = "Content-Type";

                return response;
        }



        static std::shared_ptr<server_response> handle_post ( std::shared_ptr<server_request> request ) {
                auto fsecret = request->get_form_by_key ( "secret" );
                std::shared_ptr<server_response> response;

                if ( fsecret.value != secret ) {
                        response = std::make_shared<text_response> ( );
                }
                else if ( request->api.size ( ) == 4 && request->api [3] == "secret" ) {
                        auto newkey = request->get_form_by_key ( "new" );
                        if ( !newkey.empty ( ) ) {
                                secret = newkey.value;
                                response = std::make_shared<text_response> ( request->socket, 200, "OK", "application/json", "{\"status\":\"ok\"}" );
                        }
                }
                else if ( request->api.size ( ) == 5 ) {
                        std::vector<Block *> blocks = Block::get_blocks ( );

                        auto block_search = std::find_if ( blocks.begin ( ), blocks.end ( ), [&request]( Block *block ) {
                                return block->name_ == request->api [3];
                        } );

                        if ( block_search != blocks.end ( ) ) {
                                Block *block = *block_search;

                                if ( request->api [4] == "content" ) response = block->set_content ( request );
                                else if ( request->api [4] == "list" ) response = block->set_order ( request );
                                else if ( request->api [4] == "create" ) response = block->create_object ( request );
                                else if ( request->api [4] == "remove" ) response = block->remove_object ( request );
                                else if ( request->api [4] == "attach" ) response = block->add_attachment ( request );
                                else if ( request->api [4] == "detach" ) response = block->remove_attachment ( request );
                        }
                }

                if (!response) {
                        response = std::make_shared<text_response> ( );
                }

                response->headers["Access-Control-Allow-Origin"] = "*";
                response->headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
                response->headers["Access-Control-Allow-Headers"] = "Content-Type";

                return response;
        }
};