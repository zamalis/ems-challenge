import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, "../database.yaml");
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, "utf8"));

const { sqlite_path: sqlitePath } = dbConfig;

const db = new sqlite3.Database(sqlitePath);

const employees = [
  {
    first_name: "John",
    last_name: "Doe",
    email: "johndoe@gmail.com",
    phone_number: 111111111,
    date_of_birth: "2001-01-01 00:00:00",
    job_title: "Software Engineer",
    department: "IT",
    salary: 100,
    start_contract: "2025-01-10 00:00:00",
    end_contract: "2026-01-10 00:00:00",
    photo_url: "/assets/employee-1.png",
  },
  {
    first_name: "Carl",
    last_name: "Smith",
    email: "carlsmith@gmail.com",
    phone_number: 222222222,
    date_of_birth: "2002-01-01 00:00:00",
    job_title: "Software Engineer",
    department: "IT",
    salary: 200,
    start_contract: "2026-01-10 00:00:00",
    end_contract: "2027-01-10 00:00:00",
    photo_url: "/assets/employee-2.png",
  },
  {
    first_name: "Kevin",
    last_name: "Saleem",
    email: "kevinsaleem@gmail.com",
    phone_number: 333333333,
    date_of_birth: "2003-01-01 00:00:00",
    job_title: "Software Engineer",
    department: "IT",
    salary: 300,
    start_contract: "2027-01-10 00:00:00",
    end_contract: "2028-01-10 00:00:00",
    photo_url: "/assets/employee-3.png",
  },
];

const timesheets = [
  {
    employee_id: 1,
    start_time: "2025-02-10 08:00:00",
    end_time: "2025-02-10 17:00:00",
    summary: "Implemented Authentication",
  },
];

const insertData = (table, data) => {
  const columns = Object.keys(data[0]).join(", ");
  const placeholders = Object.keys(data[0])
    .map(() => "?")
    .join(", ");

  const insertStmt = db.prepare(
    `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`
  );

  data.forEach((row) => {
    insertStmt.run(Object.values(row));
  });

  insertStmt.finalize();
};

db.serialize(() => {
  insertData("employees", employees);
  insertData("timesheets", timesheets);
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Database seeded successfully.");
  }
});
