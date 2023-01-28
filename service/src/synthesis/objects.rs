use actix_web::{
    body, get, http, post, web, App, HttpRequest, HttpResponse, HttpServer, Responder,
};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct CommonSynthsisObject {
    pub input_file_name: String,
    pub output_file_name: String,
    pub service_name: String, //  ("google" or "g", "amazon" or "a", "baidu" or "b", "ibm" or "i", "microsoft" or "m", "naver" or "n", "youdao" or "y"). The default is "google".
    pub language_name: String, // For example: en-US, de-DE, ru-RU. The default is "en-US".
    pub gender: String,
    pub voice_name: String, // For Google TTS and Microsoft Azure the rate values range from "0.1" to "3.0".For Naver TTS the rate values range from "0.5" to "1.5".
    pub speech_rate: String, //  The default is "1.0"
    pub volume: String,     // 0 to 200 (the default is 100)
}

impl Responder for CommonSynthsisObject {
    type Body = body::BoxBody;
    fn respond_to(self, _req: &HttpRequest) -> HttpResponse<Self::Body> {
        let body = serde_json::to_string(&self).unwrap();
        HttpResponse::Ok()
            .content_type(http::header::ContentType::json())
            .body(body)
    }
}
