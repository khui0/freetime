<img src="https://github.com/user-attachments/assets/e96373cd-dd81-4caf-9af8-c34a487730f5" height=128>

# Freetime

![GitHub package.json version](https://img.shields.io/github/package-json/v/khui0/freetime?color=%23990000)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/khui0/freetime?color=%23990000)
![Website](https://img.shields.io/website?url=https%3A%2F%2Ffreetime.kennyhui.dev%2F&color=%23990000)

### Try it here: [freetime.kennyhui.dev](https://freetime.kennyhui.dev/)

Schedule sharing app for Stony Brook University students.
Add your friends on Freetime and see their class progress throughout the day. Freetime also includes:
- Split-view to compare schedules
- Built-in to-do list to keep track of tasks and keep them synced between devices
- SOLAR import to quickly add your classes from your schedule
- Integrated Google Maps™ hyperlinks for every building on campus, so you can easily find your class
- iCalendar export to easily add your classes to your existing calendar application
- Google™ OAuth2 for authentication

## Backend

The current version of Freetime relies on a Pocketbase backend. This will be changed in future versions. Set up Pocketbase using [this schema](pb_schema.json)

## Development

Install dependencies

```bash
npm i
```

Run dev server

```bash
npm run dev
```

## Building

Project will be built to `/dist`

```bash
npm run build
```
