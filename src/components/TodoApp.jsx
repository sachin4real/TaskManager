import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";

const TodoApp = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const { user } = useAuth();
  const tasksRef = collection(db, "tasks");

  useEffect(() => {
    if (!user) return;
    const q = query(tasksRef, where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setTodos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [user]);

  const addTask = async () => {
    if (task.trim() !== "") {
      await addDoc(tasksRef, {
        uid: user.uid,
        text: task,
        completed: false,
        createdAt: new Date(),
      });
      setTask("");
    }
  };

  const toggleComplete = async (id, current) => {
    await updateDoc(doc(db, "tasks", id), { completed: !current });
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-xl transition-all">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">My Tasks</h1>
            <p className="text-sm text-gray-500">Logged in as: {user?.email}</p>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="bg-gray-200 text-sm px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Logout
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 border border-indigo-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="Add a new task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button
            onClick={addTask}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition"
          >
            Add
          </button>
        </div>

        {todos.length === 0 ? (
          <p className="text-gray-400 text-center mt-4 italic">No tasks yet.</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-md p-3 shadow-sm transition hover:shadow-md"
              >
                <span
                  className={`${
                    todo.completed
                      ? "line-through text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  {todo.text}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleComplete(todo.id, todo.completed)}
                    className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                  >
                    {todo.completed ? "Undo" : "Done"}
                  </button>
                  <button
                    onClick={() => deleteTask(todo.id)}
                    className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TodoApp;
