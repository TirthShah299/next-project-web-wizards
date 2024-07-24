import Task from "@/app/models/Tasks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        const { date, estimatedDuration, finalTime, status, comment, reply, qa, codeQuality, approvedByClient, developerName } = data;
        console.log("data", data.task);

        const task = new Task(data.task);
        await task.save();
        console.log("task", task);

        const response = NextResponse.json({
            message: 'Task created successfully',
            success: true,
            task: task,
        });

        return response;
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        // Fetch all tasks
        const tasks = await Task.find();
        return NextResponse.json(tasks);
    } catch (error: any) {
        console.log("error", error)
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Task ID is required' }, { status: 400 });
        }

        const data = await request.json();
        console.log("task data", data)
        const task = await Task.findByIdAndUpdate(id, data.task, { new: true, runValidators: true })
        console.log("task", task)

        if (!task) {
            return NextResponse.json({ message: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json(task, { status: 200 });
    } catch (error: any) {
        console.log("error", error)
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const url = new URL(request.url);
        console.log("url", url)
        const id = url.searchParams.get('id');
        console.log("id", id)

        if (!id) {
            return NextResponse.json({ message: 'Task ID is required' }, { status: 400 });
        }
        else {
            const project = await Task.findByIdAndDelete(id);
            if (!project) {
                return NextResponse.json({ message: 'Task not found' }, { status: 404 });
            }
            const response = NextResponse.json({
                success: true,
                message: "Task deleted Successfully"
            });
            return response;
        }
    } catch (error) {

    }

}