const OpenAI = require('openai');
const Application = require('../models/Application');
const Job = require('../models/Job');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.generateCoverLetter = async (req, res) => {
  try {
    const { jobTitle, company, jobDescription, userSkills, userExperience, userName } = req.body;

    const prompt = `Write a professional, compelling cover letter for the following:
    
Applicant Name: ${userName}
Job Title: ${jobTitle}
Company: ${company}
Job Description: ${jobDescription}
Applicant Skills: ${userSkills?.join(', ')}
Applicant Experience: ${userExperience}

Write a 3-paragraph cover letter that is enthusiastic, professional, and highlights relevant skills. Make it personalized and not generic. Start directly with "Dear Hiring Manager," and end with "Sincerely, ${userName}".`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
      temperature: 0.7,
    });

    res.json({ coverLetter: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.scoreResume = async (req, res) => {
  try {
    const { jobId, applicationId } = req.body;
    const job = await Job.findById(jobId);
    const application = await Application.findById(applicationId).populate('applicant');

    if (!job || !application) return res.status(404).json({ message: 'Not found' });

    const applicant = application.applicant;

    const prompt = `You are an expert HR analyst. Score this candidate's profile against the job requirements.

JOB TITLE: ${job.title}
JOB DESCRIPTION: ${job.description}
REQUIRED SKILLS: ${job.skills?.join(', ')}
EXPERIENCE REQUIRED: ${job.experience}

CANDIDATE PROFILE:
Name: ${applicant.name}
Skills: ${applicant.skills?.join(', ')}
Experience: ${applicant.experience}
Education: ${applicant.education}
Bio: ${applicant.bio}
Cover Letter: ${application.coverLetter}

Respond ONLY in this JSON format:
{
  "score": <number 0-100>,
  "strengths": ["strength1", "strength2", "strength3"],
  "gaps": ["gap1", "gap2"],
  "recommendation": "<brief 2-sentence recommendation>",
  "verdict": "<Strong Match | Good Match | Average Match | Weak Match>"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.3,
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());

    application.aiScore = parsed.score;
    application.aiAnalysis = JSON.stringify(parsed);
    await application.save();

    res.json(parsed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getJobSuggestions = async (req, res) => {
  try {
    const user = req.user;
    const jobs = await Job.find({ isActive: true }).limit(50);

    const prompt = `Based on this candidate's profile, suggest the top 5 most suitable job IDs from the list.

CANDIDATE:
Skills: ${user.skills?.join(', ')}
Experience: ${user.experience}
Bio: ${user.bio}

JOBS (id: title - skills):
${jobs.map(j => `${j._id}: ${j.title} - ${j.skills?.join(', ')}`).join('\n')}

Respond ONLY with a JSON array of the top 5 job IDs: ["id1", "id2", "id3", "id4", "id5"]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
    });

    const raw = completion.choices[0].message.content;
    const ids = JSON.parse(raw.replace(/```json|```/g, '').trim());
    const suggested = jobs.filter(j => ids.includes(j._id.toString()));
    res.json(suggested);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.improveJobDescription = async (req, res) => {
  try {
    const { title, description, requirements } = req.body;

    const prompt = `Improve this job description to be more attractive, clear, and professional. Keep the core requirements but make it engaging.

Title: ${title}
Description: ${description}
Requirements: ${requirements?.join(', ')}

Respond with ONLY a JSON object:
{
  "description": "<improved description>",
  "requirements": ["req1", "req2", "req3", "req4", "req5"],
  "responsibilities": ["resp1", "resp2", "resp3", "resp4", "resp5"]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
    });

    const raw = completion.choices[0].message.content;
    const result = JSON.parse(raw.replace(/```json|```/g, '').trim());
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
