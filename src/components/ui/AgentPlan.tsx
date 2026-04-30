"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  CircleAlert,
  CircleDotDashed,
  CircleX,
  ChevronRight,
  ChevronDown,
  Hammer
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

interface Subtask {
  id: string;
  title: string;
  description: string;
  status: string;
  tools?: string[];
}

interface Task {
  id: string;
  title: string;
  status: string;
  subtasks: Subtask[];
}

export default function AgentPlan({ tasks: initialTasks = [] }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [expandedTasks, setExpandedTasks] = useState<string[]>(initialTasks.length > 0 ? [initialTasks[0].id] : []);

  // Sync tasks when prop changes
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const prefersReducedMotion = 
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };


  const toggleTaskStatus = (taskId) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const statuses = ["completed", "in-progress", "pending", "need-help"];
          const currentIndex = statuses.indexOf(task.status);
          const nextStatus = statuses[(currentIndex + 1) % statuses.length];
          const updatedSubtasks = task.subtasks.map((subtask) => ({
            ...subtask,
            status: nextStatus === "completed" ? "completed" : subtask.status,
          }));
          return { ...task, status: nextStatus, subtasks: updatedSubtasks };
        }
        return task;
      }),
    );
  };

  const toggleSubtaskStatus = (taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map((subtask) => {
            if (subtask.id === subtaskId) {
              const newStatus = subtask.status === "completed" ? "pending" : "completed";
              return { ...subtask, status: newStatus };
            }
            return subtask;
          });
          const allSubtasksCompleted = updatedSubtasks.every((s) => s.status === "completed");
          return {
            ...task,
            subtasks: updatedSubtasks,
            status: allSubtasksCompleted ? "completed" : task.status,
          };
        }
        return task;
      }),
    );
  };

  const taskVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : -5 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 500, damping: 30 } }
  };

  const subtaskListVariants = {
    hidden: { height: 0, opacity: 0, overflow: "hidden" },
    visible: { height: "auto", opacity: 1, transition: { duration: 0.3, staggerChildren: 0.05 } }
  };

  return (
    <div className="agent-plan-wrapper animate-fade-in">
      <motion.div className="bg-card/30 border-border rounded-xl border shadow-2xl overflow-hidden backdrop-blur-md">
        <LayoutGroup>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
              <Hammer className="text-primary" size={20} />
              <h2 className="text-lg font-semibold tracking-tight text-main">Execution Roadmap</h2>
            </div>
            <ul className="space-y-3">
              {tasks.map((task) => {
                const isExpanded = expandedTasks.includes(task.id);
                const isCompleted = task.status === "completed";

                return (
                  <motion.li key={task.id} initial="hidden" animate="visible" variants={taskVariants} className="overflow-hidden">
                    <motion.div 
                      className={`flex items-center px-4 py-3 rounded-xl transition-all cursor-pointer border ${isExpanded ? 'bg-primary/5 border-primary/20' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                      onClick={() => toggleTaskExpansion(task.id)}
                    >
                      <div className="mr-3 flex-shrink-0" onClick={(e) => { e.stopPropagation(); toggleTaskStatus(task.id); }}>
                        {task.status === "completed" ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
                         task.status === "in-progress" ? <CircleDotDashed className="h-5 w-5 text-primary animate-spin-slow" /> :
                         task.status === "need-help" ? <CircleAlert className="h-5 w-5 text-yellow-500" /> :
                         <Circle className="text-muted h-5 w-5" />}
                      </div>

                      <div className="flex-grow min-w-0">
                        <span className={`block font-medium truncate ${isCompleted ? "text-muted line-through" : "text-main"}`}>
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 ml-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          task.status === "completed" ? "bg-green-500/20 text-green-400" :
                          task.status === "in-progress" ? "bg-primary/20 text-primary" :
                          "bg-white/10 text-muted"
                        }`}>
                          {task.status}
                        </span>
                        {isExpanded ? <ChevronDown size={16} className="text-muted" /> : <ChevronRight size={16} className="text-muted" />}
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div variants={subtaskListVariants} initial="hidden" animate="visible" exit="hidden" className="ml-9 mt-2 pl-4 border-l border-border/50">
                          <ul className="space-y-2 py-2">
                            {task.subtasks.map((subtask) => (
                              <motion.li key={subtask.id} className="group flex flex-col">
                                <div className="flex items-center gap-3 py-1 hover:translate-x-1 transition-transform" onClick={() => toggleSubtaskStatus(task.id, subtask.id)}>
                                  <div className="flex-shrink-0 cursor-pointer">
                                    {subtask.status === "completed" ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Circle className="text-muted h-4 w-4" />}
                                  </div>
                                  <span className={`text-sm ${subtask.status === "completed" ? "text-muted line-through" : "text-main"}`}>
                                    {subtask.title}
                                  </span>
                                </div>
                                <p className="text-xs text-muted pl-7 mb-2">{subtask.description}</p>
                                {subtask.tools && subtask.tools.length > 0 && (
                                  <div className="flex flex-wrap gap-1 pl-7 mb-2">
                                    {subtask.tools.map(tool => <span key={tool} className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-muted">{tool}</span>)}
                                  </div>
                                )}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </LayoutGroup>
      </motion.div>
    </div>
  );
}
