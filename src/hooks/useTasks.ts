import { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Task, CreateTaskInput, TaskStatus } from '../types';

const TASKS_COLLECTION = 'tasks';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Real-time listener for tasks
    useEffect(() => {
        const tasksQuery = query(
            collection(db, TASKS_COLLECTION),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(
            tasksQuery,
            (snapshot) => {
                const tasksData: Task[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                } as Task));
                setTasks(tasksData);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const addTask = async (input: CreateTaskInput) => {
        try {
            const taskData = {
                ...input,
                createdAt: Date.now(),
            };
            await addDoc(collection(db, TASKS_COLLECTION), taskData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add task');
        }
    };

    const updateTaskStatus = async (id: string, status: TaskStatus) => {
        // Optimistic update
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, status } : task))
        );

        try {
            const taskRef = doc(db, TASKS_COLLECTION, id);
            await updateDoc(taskRef, { status });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update task');
        }
    };

    const deleteTask = async (id: string) => {
        // Optimistic update
        setTasks((prev) => prev.filter((task) => task.id !== id));

        try {
            const taskRef = doc(db, TASKS_COLLECTION, id);
            await deleteDoc(taskRef);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete task');
        }
    };

    const updateTask = async (id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
        // Optimistic update
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, ...data } : task))
        );

        try {
            const taskRef = doc(db, TASKS_COLLECTION, id);
            await updateDoc(taskRef, data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update task');
        }
    };

    return {
        tasks,
        loading,
        error,
        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        setTasks, // Exposed for DnD reordering if needed locally
    };
};
