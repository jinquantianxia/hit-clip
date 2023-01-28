use actix_web::{
    body, get, http, post, web, App, HttpRequest, HttpResponse, HttpServer, Responder,
};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct AudioSquraeSearch {
    pub url: String,
}

#[derive(Serialize)]
pub struct AudioItemInfo {
    pub title: String,
    pub url: String,
}

impl Responder for AudioSquraeSearch {
    type Body = body::BoxBody;
    fn respond_to(self, _req: &HttpRequest) -> HttpResponse<Self::Body> {
        let body = serde_json::to_string(&self).unwrap();
        HttpResponse::Ok()
            .content_type(http::header::ContentType::json())
            .body(body)
    }
}
