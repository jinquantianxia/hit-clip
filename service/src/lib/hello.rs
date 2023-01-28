use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct CustomObject {
    pub username: String,
}
