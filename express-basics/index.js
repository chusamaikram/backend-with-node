import express from "express"
const app = express()

const port = process.env.PORT || 4000

const data = {
    name: "usama",
    age: 24,
    gender: "male"
}

app.get('/', (req, res) => {
    res.send("Hello from backend")
})
app.get('/usama', (req, res) => {
    res.json(data)
})

app.listen(port, () => {
    console.log("app running on port 3000")
})