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
                      className={`flex items-center px-4 py-3 rounded-xl transition-all cursor-pointer border ${isExpanded ? 'bg-zinc-800/40 border-zinc-700/50 shadow-lg' : 'bg-zinc-900/40 border-transparent hover:border-zinc-800 hover:bg-zinc-800/20'}`}
                      onClick={() => toggleTaskExpansion(task.id)}
                    >
                      <div className="mr-3 flex-shrink-0" onClick={(e) => { e.stopPropagation(); toggleTaskStatus(task.id); }}>
                        {task.status === "completed" ? (
                          <div className="bg-green-500/20 rounded-full p-0.5">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          </div>
                        ) : task.status === "in-progress" ? (
                          <CircleDotDashed className="h-5 w-5 text-zinc-100 animate-spin-slow" />
                        ) : task.status === "need-help" ? (
                          <CircleAlert className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <Circle className="text-zinc-600 h-5 w-5 group-hover:text-zinc-400" />
                        )}
                      </div>

                      <div className="flex-grow min-w-0">
                        <span className={`block font-medium truncate ${isCompleted ? "text-zinc-500 line-through" : "text-zinc-100"}`}>
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 ml-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          task.status === "completed" ? "bg-green-500/20 text-green-400" :
                          task.status === "in-progress" ? "bg-zinc-100/10 text-zinc-100 border border-zinc-100/20" :
                          "bg-zinc-800/50 text-zinc-500 border border-zinc-800"
                        }`}>
                          {task.status}
                        </span>
                        {isExpanded ? <ChevronDown size={16} className="text-zinc-500" /> : <ChevronRight size={16} className="text-zinc-500" />}
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div variants={subtaskListVariants} initial="hidden" animate="visible" exit="hidden" className="ml-9 mt-2 pl-4 border-l-2 border-zinc-800/50">
                          <ul className="space-y-4 py-2">
                            {task.subtasks.map((subtask) => (
                              <motion.li key={subtask.id} className="group flex flex-col cursor-pointer" onClick={() => toggleSubtaskStatus(task.id, subtask.id)}>
                                <div className="flex items-start gap-3 py-1 group-hover:translate-x-1 transition-transform">
                                  <div className="mt-0.5 flex-shrink-0">
                                    {subtask.status === "completed" ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <div className="h-4 w-4 rounded-full border-2 border-zinc-600 group-hover:border-zinc-400 transition-colors" />
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span className={`text-sm font-medium leading-none ${subtask.status === "completed" ? "text-zinc-500 line-through" : "text-zinc-200"}`}>
                                      {subtask.title}
                                    </span>
                                    <p className={`text-xs ${subtask.status === "completed" ? "text-zinc-600" : "text-zinc-400"}`}>
                                      {subtask.description}
                                    </p>
                                  </div>
                                </div>
                                {subtask.tools && subtask.tools.length > 0 && (
                                  <div className="flex flex-wrap gap-1 pl-7 mt-1">
                                    {subtask.tools.map(tool => (
                                      <span key={tool} className="text-[9px] bg-zinc-800/50 border border-zinc-700/50 px-2 py-0.5 rounded text-zinc-500 uppercase font-bold tracking-tighter">
                                        {tool}
                                      </span>
                                    ))}
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
