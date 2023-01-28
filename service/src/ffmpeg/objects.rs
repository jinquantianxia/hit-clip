use actix_web::{
    body, get, http, post, web, App, HttpRequest, HttpResponse, HttpServer, Responder,
};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct QueryFileInfo {
    pub local_path: String,
}

#[derive(Serialize, Deserialize)]
pub struct CommonConvertObject {
    pub input: String,
    pub output: String,
    pub extra: String,
}

#[derive(Serialize, Deserialize)]
pub struct VideoTrim {
    pub input: String,
    pub output: String,
    pub start: String,
    pub end: String,
}

#[derive(Serialize, Deserialize)]
pub struct AudioSquraeSearch {
    pub url: String,
}

impl Responder for QueryFileInfo {
    type Body = body::BoxBody;
    fn respond_to(self, _req: &HttpRequest) -> HttpResponse<Self::Body> {
        let body = serde_json::to_string(&self).unwrap();
        HttpResponse::Ok()
            .content_type(http::header::ContentType::json())
            .body(body)
    }
}

impl Responder for CommonConvertObject {
    type Body = body::BoxBody;
    fn respond_to(self, _req: &HttpRequest) -> HttpResponse<Self::Body> {
        let body = serde_json::to_string(&self).unwrap();
        HttpResponse::Ok()
            .content_type(http::header::ContentType::json())
            .body(body)
    }
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
