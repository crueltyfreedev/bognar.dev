// Project.js
import { ProjectData } from '@/types/project';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import Button from './button';

function ProjectView({ project }: { project: ProjectData }) {
    
    return (
        <div className="grid grid-flow-col gap-4 md:p-40 leading-loose">
            
            <div className='grid gap-8 m-5 grid-flow-row items-center justify-between'>
               
                <Button className='bg-secondary-200 shadow-secondary-200 hover:shadow-secondary-200'>
                <Link href={project.url} target="_blank" rel="noopener noreferrer">
                    Visit Project
                </Link>
                </Button>
                <p className=''>{project.longDescription}</p>
                <div>
                    <strong>Tags:</strong> {project.tags.join(', ')}
                </div>
                <div>
                    <strong>Start Date:</strong> {project.startDate}
                </div>
                <div>
                    <strong>End Date:</strong> {project.endDate}
                </div>
                <div>
                    <strong>Status:</strong> {project.status}
                </div>
                
                <Button>
                <Link href={project.githubRepo} target="_blank" rel="noopener noreferrer">
                    GitHub Repository
                </Link>
                </Button>
               
            </div>
            
        </div>
    );
}

export default ProjectView;
