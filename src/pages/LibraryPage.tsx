import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import bg from "../assets/bg.jpeg";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";

interface WordItem {
  id: string;
  word1: string;
  word2: string;
  difficulty: "easy" | "hard";
}

export default function LibraryPage() {
  const [words, setWords] = useState<WordItem[]>([]);
  const [form, setForm] = useState({
    word1: "",
    word2: "",
    difficulty: "easy",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    word1: "",
    word2: "",
    difficulty: "easy",
  });

  useEffect(() => {
    const fetchWords = async () => {
      const querySnapshot = await getDocs(collection(db, "words"));
      const data: WordItem[] = [];
      querySnapshot.forEach((docSnap) => {
        const d = docSnap.data() as DocumentData;
        data.push({
          id: docSnap.id,
          word1: d.word1,
          word2: d.word2,
          difficulty: d.difficulty === "hard" ? "hard" : "easy",
        });
      });
      setWords(data);
    };
    fetchWords();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.word1 || !form.word2) return;
    const docRef = await addDoc(collection(db, "words"), form);
    setWords([...words, { ...form, id: docRef.id } as WordItem]);
    setForm({ word1: "", word2: "", difficulty: "easy" });
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "words", id));
    setWords(words.filter((w) => w.id !== id));
  };

  const handleEdit = (item: WordItem) => {
    setEditId(item.id);
    setEditForm({
      word1: item.word1,
      word2: item.word2,
      difficulty: item.difficulty,
    });
  };

  const handleSaveEdit = async (id: string) => {
    await updateDoc(doc(db, "words", id), editForm);
    setWords(
      words.map((w) =>
        w.id === id
          ? {
              ...editForm,
              id,
              difficulty: editForm.difficulty === "hard" ? "hard" : "easy",
            }
          : w
      )
    );
    setEditId(null);
  };

  const handleCancelEdit = () => {
    setEditId(null);
  };

  const easyWords = words.filter((w) => w.difficulty === "easy");
  const hardWords = words.filter((w) => w.difficulty === "hard");

  // Cek apakah sedang edit easy/hard
  const editingEasy = editId && easyWords.some((w) => w.id === editId);
  const editingHard = editId && hardWords.some((w) => w.id === editId);

  return (
    <div className="flex h-screen relative">
      <Sidebar />

      <div className="relative flex-1 flex flex-col min-h-screen">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
          style={{ backgroundImage: `url(${bg})` }}
        />
        <div className="absolute inset-0 bg-[#0b1b2a]/70 -z-10" />

        <Navbar />

        <main className="flex-1 px-4 py-6 z-10 overflow-y-auto">
          <div className="container mx-auto flex flex-col lg:flex-row gap-6">
            {/* Form Section */}
            <section className="bg-white/90 rounded-xl shadow-lg p-6 flex-1 w-full max-w-xl mx-auto lg:mx-0">
              <form onSubmit={handleCreate}>
                <div className="flex flex-col lg:flex-row gap-4 mb-4">
                  <input
                    className="flex-1 rounded-lg px-4 py-3 text-lg font-[cursive] outline-none bg-white w-50"
                    placeholder="Word 1"
                    value={form.word1}
                    onChange={(e) =>
                      setForm({ ...form, word1: e.target.value })
                    }
                  />
                  <input
                    className="flex-1 rounded-lg px-4 py-3 text-lg font-[cursive] outline-none bg-white w-50"
                    placeholder="Word 2"
                    value={form.word2}
                    onChange={(e) =>
                      setForm({ ...form, word2: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-4">
                  <select
                    className="rounded-lg px-4 py-3 text-lg font-[cursive] outline-none flex-1 bg-white w-40"
                    value={form.difficulty}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        difficulty: e.target.value as "easy" | "hard",
                      })
                    }
                  >
                    <option value="easy">Easy</option>
                    <option value="hard">Hard</option>
                  </select>

                  <button
                    type="submit"
                    className="cursor-pointer bg-[#7b61ff] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#5a47c2] transition"
                  >
                    Add
                  </button>
                </div>
              </form>
            </section>

            {/* List Section */}
            <section className="bg-white/90 rounded-xl shadow-lg p-6 flex-1 w-full max-w-3xl mx-auto lg:mx-0">
              <div className="flex gap-8 mb-4">
                <h2 className="text-2xl font-bold font-[cursive] text-[#7b61ff] flex-1 text-left">
                  Easy
                </h2>
                <h2 className="text-2xl font-bold font-[cursive] text-[#7b61ff] flex-1 text-right">
                  Hard
                </h2>
              </div>
              <div className="flex gap-8">
                {/* Easy List */}
                {!editingHard && (
                  <div className="flex-1 space-y-3 min-w-0">
                    {easyWords.map((item) =>
                      editId === item.id ? (
                        <div
                          key={item.id}
                          className="bg-white rounded-lg flex items-center px-4 py-2 justify-between min-w-0 gap-x-2"
                        >
                          <input
                            className="font-bold font-[cursive] text-lg bg-transparent outline-none w-32 max-w-[120px]"
                            value={editForm.word1}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                word1: e.target.value,
                              })
                            }
                          />
                          <span className="mx-1 font-bold text-lg">|</span>
                          <input
                            className="font-bold font-[cursive] text-lg bg-transparent outline-none w-32 max-w-[120px]"
                            value={editForm.word2}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                word2: e.target.value,
                              })
                            }
                          />
                          <span className="flex gap-2 ml-2">
                            <button
                              className="text-green-500 hover:text-green-700"
                              onClick={() => handleSaveEdit(item.id)}
                              type="button"
                            >
                              <FaSave />
                            </button>
                            <button
                              className="text-red-400 hover:text-red-600"
                              onClick={handleCancelEdit}
                              type="button"
                            >
                              <FaTimes />
                            </button>
                          </span>
                        </div>
                      ) : (
                        <div
                          key={item.id}
                          className="bg-white rounded-lg flex items-center px-4 py-2 justify-between min-w-0"
                        >
                          <span className="font-bold font-[cursive] text-lg truncate flex-1 min-w-0">
                            {item.word1} | {item.word2}
                          </span>
                          <span className="flex gap-2 ml-2">
                            <button
                              className="text-green-500 hover:text-green-700"
                              onClick={() => handleEdit(item)}
                              type="button"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="text-red-400 hover:text-red-600"
                              onClick={() => handleDelete(item.id)}
                              type="button"
                            >
                              <FaTrash />
                            </button>
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Hard List */}
                {!editingEasy && (
                  <div className="flex-1 space-y-3 min-w-0">
                    {hardWords.map((item) =>
                      editId === item.id ? (
                        <div
                          key={item.id}
                          className="bg-white rounded-lg flex items-center px-4 py-2 justify-between min-w-0 gap-x-2"
                        >
                          <input
                            className="font-bold font-[cursive] text-lg bg-transparent outline-none w-32 max-w-[120px]"
                            value={editForm.word1}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                word1: e.target.value,
                              })
                            }
                          />
                          <span className="mx-1 font-bold text-lg">|</span>
                          <input
                            className="font-bold font-[cursive] text-lg bg-transparent outline-none w-32 max-w-[120px]"
                            value={editForm.word2}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                word2: e.target.value,
                              })
                            }
                          />
                          <span className="flex gap-2 ml-2">
                            <button
                              className="text-green-500 hover:text-green-700"
                              onClick={() => handleSaveEdit(item.id)}
                              type="button"
                            >
                              <FaSave />
                            </button>
                            <button
                              className="text-red-400 hover:text-red-600"
                              onClick={handleCancelEdit}
                              type="button"
                            >
                              <FaTimes />
                            </button>
                          </span>
                        </div>
                      ) : (
                        <div
                          key={item.id}
                          className="bg-white rounded-lg flex items-center px-4 py-2 justify-between min-w-0"
                        >
                          <span className="font-bold font-[cursive] text-lg truncate flex-1 min-w-0">
                            {item.word1} | {item.word2}
                          </span>
                          <span className="flex gap-2 ml-2">
                            <button
                              className="text-green-500 hover:text-green-700"
                              onClick={() => handleEdit(item)}
                              type="button"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="text-red-400 hover:text-red-600"
                              onClick={() => handleDelete(item.id)}
                              type="button"
                            >
                              <FaTrash />
                            </button>
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
