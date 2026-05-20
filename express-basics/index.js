import express from "express"
const app = express()

const port = process.env.PORT || 4000

const data = {
    name: "usama",
    age: 24,
    gender: "male"
}

const users = [{
    "users": [{
            "id": 1,
            "name": "Ali Khan",
            "email": "ali.khan@example.com",
            "age": 22,
            "city": "Lahore"
        },
        {
            "id": 2,
            "name": "Sara Ahmed",
            "email": "sara.ahmed@example.com",
            "age": 24,
            "city": "Karachi"
        },
        {
            "id": 3,
            "name": "Usman Tariq",
            "email": "usman.tariq@example.com",
            "age": 21,
            "city": "Islamabad"
        },
        {
            "id": 4,
            "name": "Ayesha Malik",
            "email": "ayesha.malik@example.com",
            "age": 23,
            "city": "Faisalabad"
        },
        {
            "id": 5,
            "name": "Hassan Raza",
            "email": "hassan.raza@example.com",
            "age": 25,
            "city": "Multan"
        },
        {
            "id": 6,
            "name": "Fatima Noor",
            "email": "fatima.noor@example.com",
            "age": 20,
            "city": "Peshawar"
        },
        {
            "id": 7,
            "name": "Bilal Ahmed",
            "email": "bilal.ahmed@example.com",
            "age": 26,
            "city": "Quetta"
        },
        {
            "id": 8,
            "name": "Zain Ali",
            "email": "zain.ali@example.com",
            "age": 27,
            "city": "Sialkot"
        },
        {
            "id": 9,
            "name": "Hira Shah",
            "email": "hira.shah@example.com",
            "age": 22,
            "city": "Rawalpindi"
        },
        {
            "id": 10,
            "name": "Hamza Javed",
            "email": "hamza.javed@example.com",
            "age": 28,
            "city": "Hyderabad"
        }
    ]
}]

app.get('/', (req, res) => {
    res.send("Hello from backend")
})
app.get('/usama', (req, res) => {
    res.json(data)
})
app.get('/api/users', (req, res) => {
    res.json(users)
})

app.listen(port, () => {
    console.log("app running on port 3000")
})