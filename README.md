# ChangeStreams

บริการ Go สำหรับ:
- ดูการเปลี่ยนแปลงข้อมูลจาก MongoDB ด้วย Change Stream
- จำลองสร้างข้อมูล `username` ในฐานข้อมูลหลัก
- ซิงก์ข้อมูลจาก `main` ไป `sub` (กรณี `watch collection`)

## ความสามารถหลัก

- `watch database`: ติดตามทุก collection ใน database หลัก
- `watch collection`: ติดตามเฉพาะ collection `username`
- `seed usernames`: สร้างข้อมูลเรียงลำดับ `id`, `username`
- `checkpoint`: เก็บ resume token ใน collection `watch_checkpoints`

## Prerequisites

- Go `1.22+`
- MongoDB Atlas หรือ Replica Set
  - Change Stream ใช้งานกับ MongoDB standalone ไม่ได้

## Project Entry Points

- `go run _cmd/main.go`
  - เริ่ม service หลัก (`StartServer`)
  - โค้ดปัจจุบันเปิด `WatchDatabase` บน `main` DB
- `go run _cmd/mock.go`
  - รันตัวสร้างข้อมูล `SeedMainUsernamesMain()`

## Environment Variables

โปรเจกต์อ่านค่าจาก `.env` (ผ่าน `godotenv`) โดยต้องมี:

```env
MONGODB_ENDPOINT_MAIN=<mongodb-uri-main>
MONGODB_NAME_MAIN=<main-db-name>
MONGODB_ENDPOINT_SUB=<mongodb-uri-sub>
MONGODB_NAME_SUB=<sub-db-name>
```

> แนะนำให้ใช้ user/password จาก secret manager และไม่ commit credential จริงลง repository

## Installation

```bash
go mod tidy
```

## Run

### 1) รันตัว Watch Service

```bash
go run _cmd/main.go
```

เมื่อเชื่อมต่อ MongoDB สำเร็จ service จะเริ่มดัก event จาก database หลัก

### 2) รันตัว Seed Username

```bash
go run _cmd/mock.go
```

ตัว seed จะเขียนลง collection `username` โดยรูปแบบข้อมูล:

```json
{ "id": 1, "username": "username1" }
```

และไล่ไปจนถึงจำนวนที่กำหนดใน `controller/username.go` (`usernameSeedTotal`)

## Data Flow (Current)

1. `SeedMainUsernamesMain` เขียนข้อมูลไป `main_db.username`
2. ถ้าเปิด `WatchCollection`:
   - อ่าน event จาก `main_db.username`
   - ประมวลผลใน `ProcessChangeEvent`
   - เขียนต่อไป `sub_db.username`
   - บันทึก resume token ใน `sub_db.watch_checkpoints`
3. ถ้าเปิด `WatchDatabase`:
   - อ่านทุก event ใน database หลัก
   - แสดง log ที่มี `operation_type`, `collection`, `document_key`, `full_document`

## Notes

- ถ้า seed หยุดจาก network timeout ให้รันซ้ำได้
- ถ้ามี unique index ที่ `id` หรือ `_id` อาจเกิด duplicate key ได้เมื่อใช้ insert ซ้ำ
- ปรับความเร็ว seed ได้ที่ `usernameSeedInterval` ใน `controller/username.go`
