"use client";
import Card from "@/app/components/cards";
import { useEffect, useState } from "react";
import axios from "axios";
import { errorToaster, successToaster } from "@/app/common/common";
import Link from "next/link";

export interface Project {
    _id: string
    projectName: string;
    technology: string;
    projectManager: string;
    startDate: string;
    status: string;
}

export interface User {
    userId: string;
    firstname: string;
}

export default function ProjectPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const token = localStorage.getItem('token');
    const userCategory = localStorage.getItem('userCategory');
    console.log("userCategory", userCategory)

    useEffect(() => {
        getProjects();
        getUsers();
    }, []);

    const getProjects = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            };

            const response = await axios.get('/api/projects', config);
            console.log("res projects", response.data.projects);
            setProjects(response.data.projects);
        } catch (error) {
            console.log(error);
            errorToaster("Error fetching projects");
        }
    };

    const getUsers = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            };

            const response = await axios.get('/api/users', config);
            console.log(response);
            setUsers(response.data);
        } catch (error) {
            console.log(error);
            errorToaster("Error fetching users");
        }
    };

    const getManagerName = (managerId: string) => {
        const manager = users.find(user => user.userId === managerId);
        console.log("manager", manager)
        console.log(manager?.firstname)
        return manager ? manager.firstname : "Unknown";
    }

    const handleDeleteProject = async (projectId: string) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            };
            console.log("projectId", projectId);
            const response = await axios.delete(`/api/projects?id=${projectId}`, config);
            if (response.status === 200) {
                console.log(response)
                successToaster(response.data.message);
                // Remove deleted project from state
                // setProjects(projects.filter(project => project._id !== projectId));
                // Optionally show success message
            } else {
                errorToaster('Failed to delete project');
            }
        } catch (error) {
            console.error('Error:', error);
            errorToaster('Failed to perform operation');
        }
    };

    return (
        <div className="h-full p-5">
            <h2 className="text-xl">My Projects</h2>
            <div className="border-2 w-10 border-sky-500 "></div>
            <div className="py-4">
                {projects.length > 0 ?
                    <div className="flex flex-wrap justify-md-start pb-5">
                        {projects.map((item, index) => (
                            <Card
                                projectId={item._id}
                                projectName={item.projectName}
                                startDate={item.startDate}
                                status={item.status}
                                projectManager={getManagerName(item.projectManager)}
                                userCategory={userCategory}
                                users={users} // Pass users as a prop
                                onDelete={() => handleDeleteProject(item._id)}
                            />
                        ))}
                    </div>
                    : "You do not have any project assigned...!!!"
                }
            </div>
        </div>
    )
}
