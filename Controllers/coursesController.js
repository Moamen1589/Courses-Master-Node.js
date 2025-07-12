import expressAsyncHandler from "express-async-handler";
import courses from "../Models/coursesModel.js";
const getAllCourses = expressAsyncHandler(async (req, res) => {
    const allCourses = await courses.find().select("-__v");
    res.json({ data: allCourses })
})

const courseById = expressAsyncHandler(async (req, res) => {
    const courseId = req.params.courseId
    const course = await courses.findById(courseId);
    res.json(course)
})

const addCourse = expressAsyncHandler(async (req, res) => {
    const { title, instructor, price, description } = req.body
    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!instructor) missingFields.push("instructor");
    if (!price) missingFields.push("price");
    if (!description) missingFields.push("description");
    if (missingFields.length > 0) {
        return res.status(400).json({ message: missingFields.length > 1 ? `${missingFields.join(" and ")} are required` : `${missingFields.join()} is required` });
    }
    // find same email for another course
    const sameCourse = await courses.findOne({ title: title.trim() })
    if (sameCourse) {
        return res.status(400).json({ message: "course is already exist" });
    }
    const newCourse = await courses.create({
        title,
        price,
        description,
        instructor
    })
    res.json({ data: newCourse })
})


const deleteAllCourses = expressAsyncHandler(async (req, res) => {
    await courses.deleteMany({})
    res.json({ message: "courses deleted successfully" })
})

export {
    getAllCourses,
    addCourse,
    courseById,
    deleteAllCourses
}