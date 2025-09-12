import React, { useState, useEffect } from 'react';
import { adminAPI, resourcesAPI } from '../services/api';

const QuizEditor = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [resources, setResources] = useState([]);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchQuizzes();
        fetchResources();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const response = await adminAPI.getAllQuizzes();
            setQuizzes(response.quizzes || []);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            alert('Error fetching quizzes. Please try again.');
        }
    };

    const fetchResources = async () => {
        try {
            const response = await resourcesAPI.getAll();
            setResources(response.resources || []);
        } catch (error) {
            console.error('Error fetching resources:', error);
            alert('Error fetching resources. Please try again.');
        }
    };

    const handleCreate = () => {
        setEditingQuiz({ resource_id: '', question: '', options: ['', '', '', ''], correct_answer: 0 });
        setIsCreating(true);
    };

    const handleEdit = (quiz) => {
        // Ensure options is an array for editing
        const editQuiz = {
            ...quiz,
            options: Array.isArray(quiz.options) ? quiz.options : JSON.parse(quiz.options || '["", "", "", ""]')
        };
        setEditingQuiz(editQuiz);
        setIsCreating(false);
    };

    const handleDelete = async (quizId) => {
        try {
            await adminAPI.deleteQuiz(quizId);
            fetchQuizzes();
        } catch (error) {
            console.error('Error deleting quiz:', error);
            alert('Error deleting quiz. Please try again.');
        }
    };

    const handleSave = async (quizData) => {
        try {
            // Validate required fields
            if (!quizData.resource_id || !quizData.question || !quizData.options || quizData.correct_answer === undefined) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Ensure resource_id and correct_answer are numbers
            const formattedData = {
                ...quizData,
                resource_id: parseInt(quizData.resource_id),
                correct_answer: parseInt(quizData.correct_answer),
                options: quizData.options.filter(option => option.trim() !== '') // Remove empty options
            };
            
            if (isCreating) {
                await adminAPI.createQuiz(formattedData);
            } else {
                await adminAPI.updateQuiz(editingQuiz.id, formattedData);
            }
            setEditingQuiz(null);
            fetchQuizzes();
        } catch (error) {
            console.error('Error saving quiz:', error);
            alert('Error saving quiz: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Quiz Editor</h2>
            <button onClick={handleCreate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">Create Quiz</button>
            {editingQuiz && (
                <QuizForm quiz={editingQuiz} onSave={handleSave} onCancel={() => setEditingQuiz(null)} resources={resources} />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quizzes.map(quiz => (
                    <div key={quiz.id} className="border p-4 rounded-lg">
                        <p className="font-bold">{quiz.question}</p>
                        <p>Resource ID: {quiz.resource_id}</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => handleEdit(quiz)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2">Edit</button>
                            <button onClick={() => handleDelete(quiz.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const QuizForm = ({ quiz, onSave, onCancel, resources }) => {
    const [formData, setFormData] = useState(quiz);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">{quiz.id ? 'Edit' : 'Create'} Quiz</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Resource</label>
                        <select name="resource_id" value={formData.resource_id} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <option value="">Select a resource</option>
                            {resources.map(resource => (
                                <option key={resource.id} value={resource.id}>{resource.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Question</label>
                        <input type="text" name="question" value={formData.question} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Options</label>
                        {formData.options.map((option, index) => (
                            <input key={index} type="text" value={option} onChange={(e) => handleOptionChange(index, e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2" />
                        ))}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Correct Answer (0-3)</label>
                        <input type="number" name="correct_answer" value={formData.correct_answer} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">Cancel</button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuizEditor;