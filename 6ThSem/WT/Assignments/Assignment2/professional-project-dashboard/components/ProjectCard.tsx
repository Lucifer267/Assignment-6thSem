import React from 'react';
import { Project } from '../types';
import Badge from './Badge';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export default function ProjectCard({ project, className = '' }: ProjectCardProps) {
  return (
    <div className={`card project-card ${className}`}>
      <div className="card-body">
        <h5 className="card-title">{project.title}</h5>
        <p className="card-text">{project.description}</p>
        <div className="badges-container">
          {project.technologies?.map((tech, idx) => (
            <Badge key={idx} label={tech} variant="info" />
          ))}
        </div>
        {project.status && <Badge label={project.status} variant="primary" />}
      </div>
    </div>
  );
}
