import Student from "../models/studnet.js";

export function getStudents(req, res){
    Student.find()
        .then((students) => res.json(students))  
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error fetching students");
        });
};

export function createStudent(req, res){

    if(req.user == null){
        return res.status(401).json({
            message: "Unauthorized, please login"
        });
        return;
    }

    if(req.user.role !== "admin"){
        return res.status(403).json({
            message: "Forbidden, you don't have permission to perform this action"
        });
    }

    const student = new Student({
        name: req.body.name,
        age: req.body.age,
        email: req.body.email
    });

    student.save()
        .then(() => res.send("Student saved successfully"))
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error saving student");
        });
}

export function updateStudent(req, res){
    Student.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        age: req.body.age,
        email: req.body.email
    }, { new: true })
        .then((updatedStudent) => {
            if (!updatedStudent) {
                return res.status(404).send("Student not found");
            }
            res.json(updatedStudent);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error updating student");
        });
}

export function deleteStudent(req, res){
    Student.findByIdAndDelete(req.params.id)
        .then((deletedStudent) => {
            if (!deletedStudent) {
                return res.status(404).send("Student not found");
            }
            res.json(deletedStudent);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error deleting student");
        });
}

