
const Task = require('../models/task');
const User = require('../models/user');
const addTask = async (req, res, next) => {
    const { title, description, priority, status } = req.body;
   const user = await User.findById(req.userId);

    if (!title || !description || !priority || !status) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        // Create and save the task in one step
        const task = await Task.create({
            title,
            description,
            user: req.userId, // Use the user ID from the request
            priority,
            status
        });
        // console.log(task);
        user.tasks.push(task._id);
        await user.save();
        // console.log(user)

        return res.status(200).json({
            success: true,
            message: "Task added successfully",
            task // Returning the task object
        });
    } catch (error) {
        console.log(error.message || error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong! Please try again."
        });
    }
};

 const userTask= async (req, res) => {
    try {
        // Fetch tasks associated with the logged-in user's ID
        const tasks = await Task.find({ user: req.userId });
        //  console.log(tasks)
        // If tasks are found, return them
        if (tasks) {
            return res.status(200).json({
                success: true,
                tasks
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'No tasks found for this user.'
            });
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching tasks.'
        });
    }
}
// const getTask = async (req,res,next)=>{
//     try {
//         const tasks = await Task.find().populate('user');
//         return res.status(200).json({
//             success:true,
//             tasks
//         })
//     } catch (error) {
//         console.log(error.message || error);
//         return res.status(500).json({
//             success: false,
//             message: error.message || "Something went wrong! Please try again."
//         });
//     }
// }
const deleteTask = async (req, res, next) => {
    const taskId = req.params.id;

    try {
        // Find and delete the task
        const task = await Task.findByIdAndDelete(taskId);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Find the user associated with the task
        const user = await User.findById(task.user);
        // console.log(user,"from delete controller")

        if (user) {
            // Remove the task ID from the user's tasks array
            user.tasks = user.tasks.filter(id => id.toString() !== taskId);
            await user.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
            task
        });
    } catch (error) {
        console.error(error.message || error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Something went wrong! Please try again.'
        });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, status } = req.body;
        // console.log("from update task.....")
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, priority, status },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            task: updatedTask,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong, please try again.',
        });
    }
};


const updateTaskPriority = async (req, res) => {
    const { id } = req.params;
    const { priority } = req.body;

    try {
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        task.priority = priority;
        await task.save();

        return res.status(200).json({
            success: true,
            message: 'Task priority updated successfully',
            task,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Something went wrong!',
        });
    }
}

module.exports = {userTask,addTask,deleteTask,updateTask,updateTaskPriority};

// module.exports = {addTask,getTasks}