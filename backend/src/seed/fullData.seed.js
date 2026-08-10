/**
 * Full Data Seed Script — Elder Care Operations
 * Seeds 3-4 records for every module: residents, care plans, medications,
 * activities, tasks, incidents, shifts, alerts, notifications, predictions.
 *
 * Run: node src/seed/fullData.seed.js
 * Safe to re-run — skips if records already exist.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

// Models
const User = require('../models/User');
const Resident = require('../models/Resident');
const CarePlan = require('../models/CarePlan');
const Medication = require('../models/Medication');
const Activity = require('../models/Activity');
const Task = require('../models/Task');
const Incident = require('../models/Incident');
const Shift = require('../models/Shift');
const Alert = require('../models/Alert');
const Notification = require('../models/Notification');
const Prediction = require('../models/Prediction');

const log = (emoji, msg) => console.log(`${emoji} ${msg}`);

async function seed() {
  try {
    log('🔗', 'Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    log('✅', 'Connected to MongoDB');

    // ─── Get Demo Users ──────────────────────────────────────────────────────
    const admin = await User.findOne({ email: 'admin@eldercare.com' });
    const manager = await User.findOne({ email: 'manager@eldercare.com' });
    const analyst = await User.findOne({ email: 'analyst@eldercare.com' });
    const staff = await User.findOne({ email: 'staff@eldercare.com' });

    if (!admin || !staff) {
      log('❌', 'Demo users not found. Run npm run seed:demo first!');
      process.exit(1);
    }

    // ─── RESIDENTS ───────────────────────────────────────────────────────────
    let residents = await Resident.find().limit(4);
    if (residents.length < 4) {
      log('👤', 'Seeding residents...');
      const residentData = [
        {
          residentId: 'RES-001',
          firstName: 'Margaret',
          lastName: 'Thompson',
          gender: 'Female',
          age: 82,
          dateOfBirth: '1943-04-15',
          phone: '+1-555-201-0001',
          emergencyContactName: 'James Thompson',
          emergencyContactPhone: '+1-555-301-0001',
          address: '12 Oak Street, Springfield',
          bloodGroup: 'A+',
          medicalConditions: ['Hypertension', 'Type 2 Diabetes', 'Arthritis'],
          allergies: ['Penicillin', 'Aspirin'],
          roomNumber: 'A-101',
          admissionDate: '2024-01-15',
          status: 'ACTIVE',
          createdBy: admin._id,
        },
        {
          residentId: 'RES-002',
          firstName: 'Robert',
          lastName: 'Harrison',
          gender: 'Male',
          age: 78,
          dateOfBirth: '1947-08-22',
          phone: '+1-555-201-0002',
          emergencyContactName: 'Susan Harrison',
          emergencyContactPhone: '+1-555-301-0002',
          address: '45 Maple Ave, Riverside',
          bloodGroup: 'O+',
          medicalConditions: ['Dementia', 'COPD', 'Heart Disease'],
          allergies: ['Sulfa Drugs'],
          roomNumber: 'B-205',
          admissionDate: '2024-03-10',
          status: 'ACTIVE',
          createdBy: admin._id,
        },
        {
          residentId: 'RES-003',
          firstName: 'Dorothy',
          lastName: 'Williams',
          gender: 'Female',
          age: 91,
          dateOfBirth: '1934-11-30',
          phone: '+1-555-201-0003',
          emergencyContactName: 'Carol Williams',
          emergencyContactPhone: '+1-555-301-0003',
          address: '8 Pine Road, Lakewood',
          bloodGroup: 'B-',
          medicalConditions: ['Osteoporosis', 'Alzheimers', 'Depression'],
          allergies: ['Latex', 'Ibuprofen'],
          roomNumber: 'C-312',
          admissionDate: '2023-11-05',
          status: 'ACTIVE',
          createdBy: admin._id,
        },
        {
          residentId: 'RES-004',
          firstName: 'Harold',
          lastName: 'Johnson',
          gender: 'Male',
          age: 74,
          dateOfBirth: '1951-02-18',
          phone: '+1-555-201-0004',
          emergencyContactName: 'Linda Johnson',
          emergencyContactPhone: '+1-555-301-0004',
          address: '22 Elm Boulevard, Westfield',
          bloodGroup: 'AB+',
          medicalConditions: ['Parkinson\'s Disease', 'Hypertension'],
          allergies: [],
          roomNumber: 'A-108',
          admissionDate: '2024-06-20',
          status: 'ACTIVE',
          createdBy: admin._id,
        },
      ];

      const existing = await Resident.find({ residentId: { $in: residentData.map(r => r.residentId) } });
      const existingIds = existing.map(r => r.residentId);
      const toInsert = residentData.filter(r => !existingIds.includes(r.residentId));
      if (toInsert.length > 0) await Resident.insertMany(toInsert);
      residents = await Resident.find({ residentId: { $in: ['RES-001','RES-002','RES-003','RES-004'] } });
      log('✅', `Residents: ${residents.length} records ready`);
    } else {
      log('⏭️', `Residents: ${residents.length} already exist, skipping`);
    }

    const [r1, r2, r3, r4] = residents;

    // ─── CARE PLANS ──────────────────────────────────────────────────────────
    const cpCount = await CarePlan.countDocuments();
    if (cpCount < 3) {
      log('📋', 'Seeding care plans...');
      await CarePlan.insertMany([
        {
          resident: r1._id,
          title: 'Diabetes & Hypertension Management Plan',
          description: 'Comprehensive care plan to manage Margaret\'s diabetes and hypertension through diet, medication compliance, and regular monitoring.',
          goals: ['Maintain blood sugar < 140 mg/dL', 'Blood pressure below 130/80', 'Daily mobility exercises'],
          interventions: ['Blood glucose monitoring 3x daily', 'Low-sodium diet enforcement', 'Weekly weight checks', 'Medication adherence tracking'],
          startDate: '2024-01-16',
          endDate: '2024-12-31',
          reviewDate: '2024-09-01',
          status: 'ACTIVE',
          priority: 'HIGH',
          assignedCaregiver: staff._id,
          createdBy: manager._id,
        },
        {
          resident: r2._id,
          title: 'Dementia & COPD Palliative Care Plan',
          description: 'Structured care plan for Robert with focus on cognitive support, respiratory management, and quality of life enhancement.',
          goals: ['Reduce respiratory distress episodes', 'Maintain safe mobility', 'Social engagement 3x weekly'],
          interventions: ['Oxygen therapy as needed', 'Memory stimulation activities', 'Fall prevention protocols', 'Family communication log'],
          startDate: '2024-03-11',
          reviewDate: '2024-09-15',
          status: 'ACTIVE',
          priority: 'CRITICAL',
          assignedCaregiver: staff._id,
          createdBy: manager._id,
        },
        {
          resident: r3._id,
          title: 'Alzheimers Progressive Care Support',
          description: 'Holistic care plan for Dorothy targeting cognitive slowing, fall prevention, and emotional wellness.',
          goals: ['Prevent falls and fractures', 'Maintain daily routine familiarity', 'Nutritional intake monitoring'],
          interventions: ['Anti-slip flooring checks', 'Reality orientation therapy', 'Mood journaling by staff', 'Calcium & Vitamin D supplementation'],
          startDate: '2023-11-10',
          reviewDate: '2024-11-01',
          status: 'ACTIVE',
          priority: 'HIGH',
          assignedCaregiver: staff._id,
          createdBy: manager._id,
        },
        {
          resident: r4._id,
          title: 'Parkinson\'s Motor Function Care Plan',
          description: 'Evidence-based care plan for Harold targeting motor symptom management, safety, and independence preservation.',
          goals: ['Minimize fall incidents to zero', 'Maintain self-feeding ability', 'Tremor management via medication timing'],
          interventions: ['Physical therapy 3x weekly', 'Weighted utensil provision', 'Medication schedule strictly timed', 'Adaptive equipment assessment'],
          startDate: '2024-06-21',
          reviewDate: '2024-12-21',
          status: 'ACTIVE',
          priority: 'MEDIUM',
          assignedCaregiver: staff._id,
          createdBy: manager._id,
        },
      ]);
      log('✅', 'Care Plans: 4 records created');
    } else {
      log('⏭️', `Care Plans: ${cpCount} already exist, skipping`);
    }

    // ─── MEDICATIONS ──────────────────────────────────────────────────────────
    const medCount = await Medication.countDocuments();
    if (medCount < 3) {
      log('💊', 'Seeding medications...');
      await Medication.insertMany([
        {
          resident: r1._id,
          medicationName: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          route: 'ORAL',
          instructions: 'Take with meals to reduce GI upset',
          schedule: ['08:00', '20:00'],
          startDate: '2024-01-16',
          status: 'ACTIVE',
          notes: 'Monitor for lactic acidosis symptoms',
          createdBy: manager._id,
        },
        {
          resident: r1._id,
          medicationName: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          route: 'ORAL',
          instructions: 'Take in the morning. Monitor blood pressure daily.',
          schedule: ['08:00'],
          startDate: '2024-01-16',
          status: 'ACTIVE',
          createdBy: manager._id,
        },
        {
          resident: r2._id,
          medicationName: 'Donepezil (Aricept)',
          dosage: '5mg',
          frequency: 'Once daily at bedtime',
          route: 'ORAL',
          instructions: 'Give at bedtime. Watch for vivid dreams side effect.',
          schedule: ['21:00'],
          startDate: '2024-03-12',
          status: 'ACTIVE',
          notes: 'Family informed about possible side effects',
          createdBy: manager._id,
        },
        {
          resident: r3._id,
          medicationName: 'Alendronate (Fosamax)',
          dosage: '70mg',
          frequency: 'Once weekly',
          route: 'ORAL',
          instructions: 'Take on empty stomach with full glass of water. Remain upright 30 mins after.',
          schedule: ['07:00'],
          startDate: '2023-11-10',
          status: 'ACTIVE',
          createdBy: manager._id,
        },
        {
          resident: r4._id,
          medicationName: 'Levodopa/Carbidopa (Sinemet)',
          dosage: '25/100mg',
          frequency: 'Three times daily',
          route: 'ORAL',
          instructions: 'Strict timing critical. 30 mins before meals. Avoid high-protein meals.',
          schedule: ['07:00', '13:00', '19:00'],
          startDate: '2024-06-21',
          status: 'ACTIVE',
          notes: 'Timing is critical for motor benefit window',
          createdBy: manager._id,
        },
      ]);
      log('✅', 'Medications: 5 records created');
    } else {
      log('⏭️', `Medications: ${medCount} already exist, skipping`);
    }

    // ─── ACTIVITIES ──────────────────────────────────────────────────────────
    const actCount = await Activity.countDocuments();
    if (actCount < 3) {
      log('🎯', 'Seeding activities...');
      const today = new Date();
      const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
      const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

      await Activity.insertMany([
        {
          resident: r1._id,
          activityName: 'Morning Chair Yoga',
          description: 'Low-impact yoga adapted for seated participants to improve flexibility and reduce arthritis pain.',
          activityType: 'EXERCISE',
          scheduledDate: today.toISOString(),
          duration: 45,
          assignedCaregiver: staff._id,
          status: 'SCHEDULED',
          notes: 'Use resistance bands if comfortable',
          createdBy: staff._id,
        },
        {
          resident: r2._id,
          activityName: 'Music Therapy Session',
          description: 'Individualized music therapy focusing on songs from Robert\'s era to stimulate memory and emotional connection.',
          activityType: 'THERAPY',
          scheduledDate: yesterday.toISOString(),
          duration: 60,
          assignedCaregiver: staff._id,
          status: 'COMPLETED',
          notes: 'Responded positively to big band music. Showed improved mood.',
          createdBy: staff._id,
        },
        {
          resident: r3._id,
          activityName: 'Group Painting Class',
          description: 'Weekly art therapy class aimed at cognitive stimulation and social interaction for Alzheimers residents.',
          activityType: 'RECREATIONAL',
          scheduledDate: tomorrow.toISOString(),
          duration: 90,
          assignedCaregiver: staff._id,
          status: 'SCHEDULED',
          createdBy: staff._id,
        },
        {
          resident: r4._id,
          activityName: 'Physical Therapy — Gait Training',
          description: 'Specialized physical therapy session focused on improving Harold\'s walking stability and reducing freezing episodes.',
          activityType: 'THERAPY',
          scheduledDate: today.toISOString(),
          duration: 50,
          assignedCaregiver: staff._id,
          status: 'IN_PROGRESS',
          notes: 'Using parallel bars. Progress noted in step length.',
          createdBy: staff._id,
        },
      ]);
      log('✅', 'Activities: 4 records created');
    } else {
      log('⏭️', `Activities: ${actCount} already exist, skipping`);
    }

    // ─── TASKS ───────────────────────────────────────────────────────────────
    const taskCount = await Task.countDocuments();
    if (taskCount < 3) {
      log('✅', 'Seeding tasks...');
      const due = new Date(); due.setHours(due.getHours() + 2);
      const overdue = new Date(); overdue.setDate(overdue.getDate() - 1);

      await Task.insertMany([
        {
          resident: r1._id,
          title: 'Administer Morning Insulin Check',
          description: 'Check blood glucose level and administer insulin if above 180 mg/dL. Document reading.',
          taskType: 'MEDICATION',
          assignedTo: staff._id,
          priority: 'HIGH',
          dueDate: due.toISOString(),
          status: 'PENDING',
          createdBy: manager._id,
        },
        {
          resident: r2._id,
          title: 'Cognitive Assessment — MMSE',
          description: 'Administer Mini Mental State Examination. Compare against last month baseline.',
          taskType: 'MONITORING',
          assignedTo: staff._id,
          priority: 'MEDIUM',
          dueDate: new Date(Date.now() + 3600000 * 4).toISOString(),
          status: 'IN_PROGRESS',
          createdBy: manager._id,
        },
        {
          resident: r3._id,
          title: 'Personal Hygiene Assistance — Morning',
          description: 'Assist Dorothy with morning shower, oral hygiene, and grooming. Check skin condition.',
          taskType: 'HYGIENE',
          assignedTo: staff._id,
          priority: 'HIGH',
          dueDate: due.toISOString(),
          status: 'COMPLETED',
          completedAt: new Date().toISOString(),
          notes: 'Mild redness noted on lower back. Applied barrier cream.',
          createdBy: staff._id,
        },
        {
          resident: r4._id,
          title: 'Meal Assistance — Lunch Setup',
          description: 'Set up adaptive utensils and provide meal assistance for Harold. Monitor swallowing.',
          taskType: 'MEAL',
          assignedTo: staff._id,
          priority: 'MEDIUM',
          dueDate: new Date(Date.now() + 3600000 * 1).toISOString(),
          status: 'PENDING',
          createdBy: staff._id,
        },
      ]);
      log('✅', 'Tasks: 4 records created');
    } else {
      log('⏭️', `Tasks: ${taskCount} already exist, skipping`);
    }

    // ─── INCIDENTS ───────────────────────────────────────────────────────────
    const incCount = await Incident.countDocuments();
    if (incCount < 3) {
      log('⚠️', 'Seeding incidents...');
      await Incident.insertMany([
        {
          resident: r3._id,
          incidentType: 'FALL',
          title: 'Near-Fall in Bathroom',
          description: 'Dorothy nearly fell while exiting the shower. Staff member present caught her. No injury sustained. Anti-slip mat was displaced.',
          incidentDate: new Date(Date.now() - 86400000 * 2).toISOString(),
          severity: 'MEDIUM',
          location: 'Room C-312 Bathroom',
          reportedBy: staff._id,
          assignedTo: manager._id,
          status: 'INVESTIGATING',
          actionTaken: 'Anti-slip mat secured. Grip bars inspection scheduled.',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          resident: r2._id,
          incidentType: 'BEHAVIORAL',
          title: 'Agitation Episode — Evening',
          description: 'Robert displayed significant agitation and verbal aggression during evening care. Sundowning episode suspected.',
          incidentDate: new Date(Date.now() - 86400000 * 5).toISOString(),
          severity: 'MEDIUM',
          location: 'Room B-205',
          reportedBy: staff._id,
          assignedTo: manager._id,
          status: 'RESOLVED',
          actionTaken: 'Redirected with music therapy. Dr. notified. Medication review scheduled.',
        },
        {
          resident: r1._id,
          incidentType: 'MEDICAL',
          title: 'Hypoglycemic Episode',
          description: 'Margaret experienced blood sugar drop to 62 mg/dL after missing lunch. Treated with glucose tablets immediately.',
          incidentDate: new Date(Date.now() - 86400000 * 10).toISOString(),
          severity: 'HIGH',
          location: 'Room A-101',
          reportedBy: staff._id,
          assignedTo: manager._id,
          status: 'RESOLVED',
          actionTaken: 'Glucose tablets administered. Blood sugar stabilized to 98 mg/dL. Meal monitoring enhanced.',
        },
        {
          resident: r4._id,
          incidentType: 'FALL',
          title: 'Fall During Transfer',
          description: 'Harold lost balance during bed-to-wheelchair transfer. Fell to floor. Minor bruising on left knee.',
          incidentDate: new Date(Date.now() - 86400000 * 1).toISOString(),
          severity: 'HIGH',
          location: 'Room A-108',
          reportedBy: staff._id,
          assignedTo: manager._id,
          status: 'OPEN',
          actionTaken: 'First aid applied. X-ray ordered. Family notified. Transfer protocol under review.',
        },
      ]);
      log('✅', 'Incidents: 4 records created');
    } else {
      log('⏭️', `Incidents: ${incCount} already exist, skipping`);
    }

    // ─── SHIFTS ──────────────────────────────────────────────────────────────
    const shiftCount = await Shift.countDocuments();
    if (shiftCount < 3) {
      log('🗓️', 'Seeding shifts...');
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      await Shift.insertMany([
        {
          caregiver: staff._id,
          shiftDate: today,
          shiftType: 'MORNING',
          startTime: '07:00',
          endTime: '15:00',
          assignedResidents: [r1._id, r3._id],
          status: 'IN_PROGRESS',
          notes: 'Covering East Wing — A101 and C312',
          createdBy: manager._id,
        },
        {
          caregiver: staff._id,
          shiftDate: yesterday,
          shiftType: 'AFTERNOON',
          startTime: '15:00',
          endTime: '23:00',
          assignedResidents: [r2._id, r4._id],
          status: 'COMPLETED',
          notes: 'Evening rounds completed without issues',
          createdBy: manager._id,
        },
        {
          caregiver: manager._id,
          shiftDate: today,
          shiftType: 'AFTERNOON',
          startTime: '15:00',
          endTime: '23:00',
          assignedResidents: [r2._id],
          status: 'SCHEDULED',
          notes: 'Supervisor shift — reviewing care documentation',
          createdBy: admin._id,
        },
        {
          caregiver: staff._id,
          shiftDate: tomorrow,
          shiftType: 'NIGHT',
          startTime: '23:00',
          endTime: '07:00',
          assignedResidents: [r1._id, r2._id, r3._id, r4._id],
          status: 'SCHEDULED',
          notes: 'Full wing night coverage',
          createdBy: manager._id,
        },
      ]);
      log('✅', 'Shifts: 4 records created');
    } else {
      log('⏭️', `Shifts: ${shiftCount} already exist, skipping`);
    }

    // ─── ALERTS ──────────────────────────────────────────────────────────────
    const alertCount = await Alert.countDocuments();
    if (alertCount < 3) {
      log('🔔', 'Seeding alerts...');
      await Alert.insertMany([
        {
          resident: r4._id,
          alertType: 'FALL_RISK',
          title: 'High Fall Risk — Room A-108',
          message: 'Harold Johnson has been flagged as HIGH fall risk following yesterday\'s transfer incident. Immediate protocol review required.',
          severity: 'HIGH',
          status: 'ACTIVE',
          source: 'AI',
          assignedTo: manager._id,
          createdBy: admin._id,
        },
        {
          resident: r1._id,
          alertType: 'MEDICATION',
          title: 'Missed Medication — Metformin',
          message: 'Margaret Thompson\'s evening Metformin dose was not recorded for August 9th. Please verify administration.',
          severity: 'MEDIUM',
          status: 'ACKNOWLEDGED',
          source: 'SYSTEM',
          assignedTo: staff._id,
          acknowledgedBy: manager._id,
          acknowledgedAt: new Date().toISOString(),
          createdBy: admin._id,
        },
        {
          resident: r3._id,
          alertType: 'HEALTH',
          title: 'Skin Integrity Concern',
          message: 'Pressure area redness noted on Dorothy Williams lower back during morning hygiene. Preventive measures initiated.',
          severity: 'MEDIUM',
          status: 'ACTIVE',
          source: 'USER',
          assignedTo: manager._id,
          createdBy: staff._id,
        },
        {
          resident: r2._id,
          alertType: 'INCIDENT',
          title: 'Behavioral Incident Follow-Up Required',
          message: 'Robert Harrison\'s behavioral episode from 5 days ago requires psychiatrist follow-up and medication review.',
          severity: 'LOW',
          status: 'ACKNOWLEDGED',
          source: 'SYSTEM',
          assignedTo: manager._id,
          createdBy: admin._id,
        },
      ]);
      log('✅', 'Alerts: 4 records created');
    } else {
      log('⏭️', `Alerts: ${alertCount} already exist, skipping`);
    }

    // ─── NOTIFICATIONS ───────────────────────────────────────────────────────
    const notifCount = await Notification.countDocuments();
    if (notifCount < 3) {
      log('📩', 'Seeding notifications...');
      await Notification.insertMany([
        {
          recipient: staff._id,
          title: 'Shift Starting Soon',
          message: 'Your morning shift begins in 30 minutes. Please check in at the nursing station.',
          type: 'SHIFT',
          priority: 'HIGH',
          isRead: false,
          createdBy: admin._id,
        },
        {
          recipient: manager._id,
          title: 'New Incident Report — Room A-108',
          message: 'A fall incident has been reported for Harold Johnson in Room A-108. Review and action required.',
          type: 'INCIDENT',
          priority: 'URGENT',
          isRead: false,
          createdBy: admin._id,
        },
        {
          recipient: staff._id,
          title: 'Medication Administration Reminder',
          message: 'Margaret Thompson\'s Metformin 500mg is due at 08:00. Please confirm administration.',
          type: 'MEDICATION',
          priority: 'HIGH',
          isRead: true,
          readAt: new Date().toISOString(),
          createdBy: admin._id,
        },
        {
          recipient: analyst._id,
          title: 'Weekly Report Ready',
          message: 'The weekly operational summary report for August Week 2 is ready for your review.',
          type: 'SYSTEM',
          priority: 'LOW',
          isRead: false,
          createdBy: admin._id,
        },
      ]);
      log('✅', 'Notifications: 4 records created');
    } else {
      log('⏭️', `Notifications: ${notifCount} already exist, skipping`);
    }

    // ─── PREDICTIONS ─────────────────────────────────────────────────────────
    const predCount = await Prediction.countDocuments();
    if (predCount < 3) {
      log('🤖', 'Seeding predictions...');
      await Prediction.insertMany([
        {
          resident: r4._id,
          predictionType: 'FALL_RISK',
          riskLevel: 'HIGH',
          probability: 0.87,
          score: 87,
          explanation: 'Harold Johnson exhibits multiple fall risk factors: Parkinson\'s Disease with increasing tremor severity, recent fall incident, gait instability, and high-dose Levodopa associated with dyskinesia episodes.',
          recommendations: [
            'Install bed exit alarm immediately',
            'Two-person assist for all transfers',
            'Physiotherapy evaluation within 48 hours',
            'Review Levodopa timing with attending physician',
          ],
          status: 'ACTIVE',
        },
        {
          resident: r2._id,
          predictionType: 'HEALTH_RISK',
          riskLevel: 'HIGH',
          probability: 0.76,
          score: 76,
          explanation: 'Robert Harrison presents with combined COPD and advancing dementia, indicating elevated hospitalization risk. Recent behavioral incidents and oxygen saturation trends below baseline increase concern.',
          recommendations: [
            'Weekly SpO2 monitoring protocol',
            'Pulmonologist consultation',
            'Family meeting to discuss advance directives',
            'Review antipsychotic options with psychiatrist',
          ],
          status: 'ACTIVE',
        },
        {
          resident: r3._id,
          predictionType: 'FALL_RISK',
          riskLevel: 'MEDIUM',
          probability: 0.58,
          score: 58,
          explanation: 'Dorothy Williams has osteoporosis with Alzheimers, creating moderate fall risk from cognitive wandering and bone fragility. Near-fall event documented 2 days ago elevates score.',
          recommendations: [
            'Install motion-activated night lights',
            'DEXA scan to assess bone density',
            'Review current fall prevention interventions',
            'Consider hip protector pads',
          ],
          status: 'REVIEWED',
        },
        {
          resident: r1._id,
          predictionType: 'MEDICATION_RISK',
          riskLevel: 'MEDIUM',
          probability: 0.45,
          score: 45,
          explanation: 'Margaret Thompson shows moderate medication risk due to polypharmacy (Metformin + Lisinopril + Aspirin allergy noted). Recent hypoglycemic episode indicates dose management needed.',
          recommendations: [
            'Pharmacist medication reconciliation review',
            'Continuous glucose monitoring evaluation',
            'Dietary consultation for carbohydrate management',
          ],
          status: 'ACTIVE',
        },
      ]);
      log('✅', 'Predictions: 4 records created');
    } else {
      log('⏭️', `Predictions: ${predCount} already exist, skipping`);
    }

    // ─── SUMMARY ─────────────────────────────────────────────────────────────
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Full Seed Summary:');
    console.log(`   Residents    : ${await Resident.countDocuments()}`);
    console.log(`   Care Plans   : ${await CarePlan.countDocuments()}`);
    console.log(`   Medications  : ${await Medication.countDocuments()}`);
    console.log(`   Activities   : ${await Activity.countDocuments()}`);
    console.log(`   Tasks        : ${await Task.countDocuments()}`);
    console.log(`   Incidents    : ${await Incident.countDocuments()}`);
    console.log(`   Shifts       : ${await Shift.countDocuments()}`);
    console.log(`   Alerts       : ${await Alert.countDocuments()}`);
    console.log(`   Notifications: ${await Notification.countDocuments()}`);
    console.log(`   Predictions  : ${await Prediction.countDocuments()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    log('🎉', 'All seed data ready! The application is now fully populated.');

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    log('🔌', 'Disconnected from MongoDB');
    process.exit(0);
  }
}

seed();
