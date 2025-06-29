use aes_gcm::{aead::AeadMut, Aes256Gcm, Key, KeyInit, Nonce};
use rand::RngCore;
use serde::{Deserialize, Serialize};
use std::env;

const NONCE_LENGTH: usize = 12;

#[derive(Serialize, Deserialize)]
struct SensFloorConnectionInfo {
    ip: String,
    port: i32,
}

fn get_encryption_key() -> Result<Key<Aes256Gcm>, String> {
    let key_encoded =
        env::var("ENCRYPTION_KEY").map_err(|_| "Failed to find 'ENCRYPTION_KEY' in .env")?;
    let key_as_bytes =
        hex::decode(&key_encoded).map_err(|_| "Failed to decode hex encryption key")?;

    Ok(Key::<Aes256Gcm>::from_slice(&key_as_bytes).clone())
}

#[tauri::command]
fn does_file_exist(path: String) -> bool {
    std::path::Path::new(&path).exists()
}

#[tauri::command]
fn read_text_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[tauri::command]
fn read_binary_file(path: String) -> Result<Vec<u8>, String> {
    use std::fs;
    fs::read(&path).map_err(|e| e.to_string())
}

#[tauri::command]
fn write_text_file(path: String, content: String) -> Result<(), String> {
    std::fs::write(&path, content).map_err(|e| e.to_string())
}

#[tauri::command]
fn write_binary_file(path: String, content: &[u8]) -> Result<(), String> {
    std::fs::write(&path, content).map_err(|e| e.to_string())
}

#[tauri::command]
fn load_sensfloor_connection_info(path: String) -> Result<SensFloorConnectionInfo, String> {
    let key = get_encryption_key()?;
    let mut cipher = Aes256Gcm::new(&key);

    let data = read_binary_file(path)?;

    let nonce_bytes = &data[..NONCE_LENGTH];
    let nonce = Nonce::from_slice(nonce_bytes);
    let ciphertext = &data[NONCE_LENGTH..];

    let decrypted = cipher
        .decrypt(nonce, ciphertext)
        .map_err(|_| "Failed to decrypt data")?;
    let connection_info: SensFloorConnectionInfo = serde_json::from_slice(&decrypted)
        .map_err(|_| "Failed to convert decrypted data into connection info")?;

    Ok(connection_info)
}

#[tauri::command]
fn save_sensfloor_connection_info(
    path: String,
    connection_info: SensFloorConnectionInfo,
) -> Result<(), String> {
    let key = get_encryption_key()?;
    let mut cipher = Aes256Gcm::new(&key);

    let data = serde_json::to_vec(&connection_info).map_err(|e| e.to_string())?;

    let mut nonce_bytes = [0u8; NONCE_LENGTH];
    rand::rng().fill_bytes(&mut nonce_bytes);
    let nonce = Nonce::from_slice(&nonce_bytes);

    let ciphertext = cipher
        .encrypt(nonce, data.as_ref())
        .map_err(|_| "Failed to encrypt connection info")?;

    let mut file_bytes = nonce_bytes.to_vec();
    file_bytes.extend(ciphertext);

    write_binary_file(path, &file_bytes)?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    dotenvy::dotenv().ok();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            does_file_exist,
            read_text_file,
            read_binary_file,
            write_text_file,
            load_sensfloor_connection_info,
            save_sensfloor_connection_info
        ])
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
