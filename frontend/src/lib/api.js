// API helper for fetching data from the Express backend
const API_BASE = import.meta.env.PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Fetch all published courses
 */
export async function fetchCourses() {
  const res = await fetch(`${API_BASE}/api/courses`);
  if (!res.ok) throw new Error(`Failed to fetch courses: ${res.status}`);
  return res.json();
}

/**
 * Fetch a single course by slug with its nested topic hierarchy
 */
export async function fetchCourse(courseSlug) {
  const res = await fetch(`${API_BASE}/api/courses/${courseSlug}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch course: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch top-level topics for a course (navigation data)
 */
export async function fetchTopics(courseSlug) {
  const res = await fetch(`${API_BASE}/api/courses/${courseSlug}/topics`);
  if (!res.ok) throw new Error(`Failed to fetch topics: ${res.status}`);
  return res.json();
}

/**
 * Fetch a specific topic with its content blocks
 */
export async function fetchTopic(courseSlug, topicSlug) {
  const res = await fetch(`${API_BASE}/api/courses/${courseSlug}/topic/${topicSlug}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch topic: ${res.status}`);
  }
  return res.json();
}
