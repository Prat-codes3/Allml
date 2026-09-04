import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// 1. GET /api/courses — List all published courses
router.get('/', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        seoTitle: true,
        seoDescription: true,
        ogImage: true,
        publishedAt: true,
      },
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET /api/courses/:courseSlug — Get course metadata with nested topic hierarchy (for syllabus/navigation)
router.get('/:courseSlug', async (req, res) => {
  try {
    const { courseSlug } = req.params;
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: {
        topics: {
          where: { parentId: null, isPublished: true },
          orderBy: { position: 'asc' },
          include: {
            children: {
              where: { isPublished: true },
              orderBy: { position: 'asc' },
              include: {
                children: {
                  where: { isPublished: true },
                  orderBy: { position: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. GET /api/courses/:courseSlug/topics — Get all top-level topics for a course
router.get('/:courseSlug/topics', async (req, res) => {
  try {
    const { courseSlug } = req.params;
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const topics = await prisma.topic.findMany({
      where: {
        courseId: course.id,
        parentId: null,
        isPublished: true,
      },
      orderBy: { position: 'asc' },
      include: {
        children: {
          where: { isPublished: true },
          orderBy: { position: 'asc' },
          select: {
            id: true,
            title: true,
            slug: true,
            position: true,
          },
        },
      },
    });

    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. GET /api/courses/:courseSlug/topic/:topicSlug — Get tutorial page by slug with ordered ContentBlocks
router.get('/:courseSlug/topic/:topicSlug', async (req, res) => {
  try {
    const { courseSlug, topicSlug } = req.params;
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true, title: true, slug: true },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const topic = await prisma.topic.findUnique({
      where: {
        courseId_slug: {
          courseId: course.id,
          slug: topicSlug,
        },
      },
      include: {
        parent: {
          select: { id: true, title: true, slug: true },
        },
        children: {
          where: { isPublished: true },
          orderBy: { position: 'asc' },
          select: { id: true, title: true, slug: true, description: true, position: true },
        },
        contentBlocks: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    res.json({
      course,
      topic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
