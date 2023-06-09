import {NextRequest, NextResponse} from "next/server";
import {ProjectRequestResponse} from "@/app/api/projects/datatypes/ProjectRequestResponse";
import {Project} from '@prisma/client'
import { prisma } from '../db'
import {ProjectGetRequestBody} from "@/app/api/projects/datatypes/ProjectGetRequestBody";

export async function GET(request:NextRequest) {
    let id = await request.nextUrl.searchParams.get("id");
    let data: ProjectRequestResponse;
    if(id == null) {
        const allProjects = await getProject("");
        data = {
            projects: allProjects
        }
    } else {
        let project = await getProject(id);
        data = {
            projects:project
        }
    }
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    let project:Project = await request.json();
    const createProject = await prisma.project.create({data:project});
    return NextResponse.json("we good");
}

export async function getProject(id:string):Promise<Project[]> {
    let projects:Project[] = [];
    if(id === "") {
        projects = await prisma.project.findMany();
    } else {
        const project = await prisma.project.findFirst({
            where: {
                id: id
            }
        });
        if(project != null) {
            projects.push(project)
        }
    }
    return projects;
}