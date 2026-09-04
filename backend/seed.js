import { PrismaClient } from '@prisma/client';

process.loadEnvFile();

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Seeding Phase 1 Educational Content...');

    // 1. Create Course: Agentic AI
    const course = await prisma.course.upsert({
      where: { slug: 'agentic-ai' },
      update: {},
      create: {
        title: 'Agentic AI',
        slug: 'agentic-ai',
        description: 'Master autonomous AI agents, tool calling, memory systems, RAG, and evaluation workflows.',
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a',
        seoTitle: 'Agentic AI Course — Build Autonomous AI Agents | Allml',
        seoDescription: 'Comprehensive guide to building production-ready Agentic AI systems with RAG and LLM tool calling.',
        ogImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a',
        isPublished: true,
        publishedAt: new Date(),
      },
    });
    console.log('Created Course:', course.title);

    // 2. Create Top-Level Topic: RAG
    const ragTopic = await prisma.topic.upsert({
      where: {
        courseId_slug: {
          courseId: course.id,
          slug: 'rag',
        },
      },
      update: {},
      create: {
        title: 'RAG (Retrieval Augmented Generation)',
        slug: 'rag',
        description: 'Learn how to ground Large Language Models with external real-time data and proprietary knowledge bases.',
        position: 0,
        seoTitle: 'What is RAG? Retrieval Augmented Generation Guide | Allml',
        seoDescription: 'Understand RAG architecture, retrieval mechanisms, embeddings, and vector databases.',
        isPublished: true,
        publishedAt: new Date(),
        courseId: course.id,
        parentId: null,
      },
    });
    console.log('Created Top-Level Topic:', ragTopic.title);

    // 3. Create Subtopic: What is RAG?
    const whatIsRagTopic = await prisma.topic.upsert({
      where: {
        courseId_slug: {
          courseId: course.id,
          slug: 'what-is-rag',
        },
      },
      update: {},
      create: {
        title: 'What is RAG?',
        slug: 'what-is-rag',
        description: 'An intuitive introduction to Retrieval Augmented Generation concepts and architectures.',
        position: 0,
        seoTitle: 'What is RAG? Beginner Tutorial & Architecture | Allml',
        seoDescription: 'Learn how RAG solves hallucination and outdated training data in LLMs with a complete visual walkthrough.',
        isPublished: true,
        publishedAt: new Date(),
        courseId: course.id,
        parentId: ragTopic.id,
      },
    });
    console.log('Created Subtopic:', whatIsRagTopic.title);

    // 4. Clean old blocks for this subtopic and add fresh sample ContentBlocks
    await prisma.contentBlock.deleteMany({
      where: { topicId: whatIsRagTopic.id },
    });

    const blocks = await prisma.contentBlock.createMany({
      data: [
        {
          topicId: whatIsRagTopic.id,
          type: 'TEXT',
          position: 0,
          content: {
            text: 'Retrieval Augmented Generation (RAG) is an architectural framework that enhances Large Language Models (LLMs) by fetching authoritative information from external knowledge bases before generating a response.',
          },
        },
        {
          topicId: whatIsRagTopic.id,
          type: 'IMAGE',
          position: 1,
          content: {
            url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
            alt: 'RAG Workflow Architecture Diagram',
            caption: 'Figure 1.1: Query -> Retrieval -> Augmentation -> Generation Pipeline',
          },
        },
        {
          topicId: whatIsRagTopic.id,
          type: 'CALLOUT',
          position: 2,
          content: {
            variant: 'info',
            title: 'Why RAG Matters',
            text: 'Instead of retraining or fine-tuning billion-parameter models to update facts, RAG injects fresh contextual documents directly into the prompt.',
          },
        },
        {
          topicId: whatIsRagTopic.id,
          type: 'CODE',
          position: 3,
          content: {
            language: 'python',
            filename: 'simple_rag.py',
            code: `from langchain_community.vectorstores import Chroma\nfrom langchain_openai import OpenAIEmbeddings, ChatOpenAI\nfrom langchain.chains import create_retrieval_chain\n\n# 1. Embed query and retrieve nearest chunk\nvectorstore = Chroma(persist_directory="./db", embedding_function=OpenAIEmbeddings())\nretriever = vectorstore.as_retriever(search_kwargs={"k": 3})\n\n# 2. Augment context and ask LLM\nllm = ChatOpenAI(model="gpt-4o-mini")\nprint("RAG pipeline initialized successfully!")`,
          },
        },
        {
          topicId: whatIsRagTopic.id,
          type: 'VIDEO',
          position: 4,
          content: {
            url: 'https://www.youtube.com/watch?v=T-D1OfcDW1M',
            provider: 'youtube',
            title: 'Visual Explanation of Retrieval Augmented Generation',
          },
        },
      ],
    });

    console.log(`Successfully seeded ${blocks.count} ContentBlocks for "${whatIsRagTopic.title}"!`);
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

