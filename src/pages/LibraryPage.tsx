import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import bg from "../assets/bg.jpeg";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

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

  // ✅ NEW: Confirm Delete Popup State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "words"), (snapshot) => {
      const data: WordItem[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        data.push({
          id: docSnap.id,
          word1: d.word1,
          word2: d.word2,
          difficulty: d.difficulty === "hard" ? "hard" : "easy",
        });
      });
      setWords(data);
    });

    return () => unsubscribe();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.word1.trim() || !form.word2.trim()) {
      alert("Please fill both words.");
      return;
    }
    try {
      await addDoc(collection(db, "words"), {
        word1: form.word1.trim(),
        word2: form.word2.trim(),
        difficulty: form.difficulty === "hard" ? "hard" : "easy",
      });
      setForm({ word1: "", word2: "", difficulty: "easy" });
    } catch (err) {
      console.error("Failed to add word:", err);
      alert("Failed to add word. Check your connection.");
    }
  };

  // ✅ NEW: Delete Flow with Confirm
  const handleDeleteRequest = (id: string) => {
    setConfirmDeleteId(id);
  };

const handleDeleteConfirm = async () => {
  if (!confirmDeleteId) return;
  const idToDelete = confirmDeleteId;  
  setConfirmDeleteId(null);             
  try {
    await deleteDoc(doc(db, "words", idToDelete));
  } catch (err) {
    console.error("Failed to delete:", err);
    alert("Failed to delete. Try again.");
  }
};


  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
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
    if (!editForm.word1.trim() || !editForm.word2.trim()) {
      alert("Please fill both words to save changes.");
      return;
    }
    try {
      await updateDoc(doc(db, "words", id), {
        word1: editForm.word1.trim(),
        word2: editForm.word2.trim(),
        difficulty: editForm.difficulty === "hard" ? "hard" : "easy",
      });
      setEditId(null);
    } catch (err) {
      console.error("Failed to save changes:", err);
      alert("Failed to save. Check your connection.");
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
  };

  const easyWords = words.filter((w) => w.difficulty === "easy");
  const hardWords = words.filter((w) => w.difficulty === "hard");

  const editingEasy = editId && easyWords.some((w) => w.id === editId);
  const editingHard = editId && hardWords.some((w) => w.id === editId);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />

      <div className="relative flex-1 flex flex-col">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
          style={{ backgroundImage: `url(${bg})` }}
        />
        <div className="absolute inset-0 bg-[#0b1b2a]/60 -z-10" />

        <div className="sticky top-0 z-20">
          <Navbar />
        </div>

        <main className="flex-1 px-4 py-6 overflow-y-auto w-full">
          <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            <section className="bg-gray-300 rounded-xl shadow-xl p-6 flex-shrink-0 w-full h-auto max-w-sm mx-auto lg:mx-0">
              <h2 className="text-xl font-bold mb-4 text-[#22364a]">
                Add New Words
              </h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="flex flex-col gap-4">
                  <input
                    className="rounded-lg px-4 py-3 text-lg font-[cursive] outline-none bg-white w-full"
                    placeholder="Word 1"
                    value={form.word1}
                    onChange={(e) =>
                      setForm({ ...form, word1: e.target.value })
                    }
                  />
                  <input
                    className="rounded-lg px-4 py-3 text-lg font-[cursive] outline-none bg-white w-full"
                    placeholder="Word 2"
                    value={form.word2}
                    onChange={(e) =>
                      setForm({ ...form, word2: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <select
                    className="rounded-lg px-4 py-3 text-lg font-[cursive] outline-none bg-white w-full"
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
                    className="bg-[#7b61ff] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#5a47c2] transition w-full sm:w-auto"
                  >
                    Add
                  </button>
                </div>
              </form>
            </section>

            <section className="bg-gray-300 rounded-xl shadow-xl p-6 flex-1 overflow-hidden">
              <div className="flex flex-col lg:flex-row gap-8">
                {!editingHard && (
                  <div className="flex-1 space-y-3 min-w-0">
                    <h2 className="text-2xl font-bold font-[cursive] text-[#7b61ff] mb-4">
                      Easy
                    </h2>
                    {easyWords.map((item) => (
                      <WordItemComponent
                        key={item.id}
                        item={item}
                        editId={editId}
                        editForm={editForm}
                        handleEdit={handleEdit}
                        handleSaveEdit={handleSaveEdit}
                        handleCancelEdit={handleCancelEdit}
                        handleDeleteRequest={handleDeleteRequest}
                        setEditForm={setEditForm}
                      />
                    ))}
                  </div>
                )}

                {!editingEasy && (
                  <div className="flex-1 space-y-3 min-w-0">
                    <h2 className="text-2xl font-bold font-[cursive] text-[#7b61ff] mb-4">
                      Hard
                    </h2>
                    {hardWords.map((item) => (
                      <WordItemComponent
                        key={item.id}
                        item={item}
                        editId={editId}
                        editForm={editForm}
                        handleEdit={handleEdit}
                        handleSaveEdit={handleSaveEdit}
                        handleCancelEdit={handleCancelEdit}
                        handleDeleteRequest={handleDeleteRequest}
                        setEditForm={setEditForm}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* ✅ Confirm Delete Popup */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center">
            <div className="text-2xl font-bold mb-4 text-[#22364a]">
              Are you sure you want to delete this word?
            </div>
            <div className="flex gap-6 mt-4">
              <button
                className="bg-[#FFB3B3] text-[#22364a] font-bold px-6 py-2 rounded-lg shadow hover:bg-[#ffe7a0] transition"
                onClick={handleDeleteConfirm}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 text-[#22364a] font-bold px-6 py-2 rounded-lg shadow hover:bg-gray-400 transition"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WordItemComponent({
  item,
  editId,
  editForm,
  handleEdit,
  handleSaveEdit,
  handleCancelEdit,
  handleDeleteRequest,
  setEditForm,
}: any) {
  return editId === item.id ? (
    <div className="bg-white rounded-lg flex items-center px-4 py-2 justify-between gap-x-2 min-w-0">
      <input
        className="font-bold font-[cursive] text-lg bg-transparent outline-none w-32 max-w-[120px]"
        value={editForm.word1}
        onChange={(e) =>
          setEditForm((prev: any) => ({ ...prev, word1: e.target.value }))
        }
      />
      <span className="mx-1 font-bold text-lg">|</span>
      <input
        className="font-bold font-[cursive] text-lg bg-transparent outline-none w-32 max-w-[120px]"
        value={editForm.word2}
        onChange={(e) =>
          setEditForm((prev: any) => ({ ...prev, word2: e.target.value }))
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
    <div className="bg-white rounded-lg flex items-center px-4 py-2 justify-between min-w-0">
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
          onClick={() => handleDeleteRequest(item.id)}
          type="button"
        >
          <FaTrash />
        </button>
      </span>
    </div>
  );
}
