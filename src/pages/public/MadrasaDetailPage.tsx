import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  MapPin,
  Users,
  Award,
  Calendar,
  Building,
  GraduationCap,
  ArrowLeft,
  CheckCircle2,
  Phone,
  HeartHandshake,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const MadrasaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { madrasas, students, teachers, mosques } = useApp();
  const navigate = useNavigate();

  const madrasa = madrasas.find((m) => m.id === id) || madrasas[0];
  const linkedMosque = mosques.find((mos) => mos.id === madrasa.mosqueId || mos.name === madrasa.mosqueName);
  const enrolledStudents = students.filter((s) => s.madrasaId === madrasa.id || s.madrasaName === madrasa.name);
  const facultyTeachers = teachers.filter((t) => t.madrasaId === madrasa.id || t.madrasaName === madrasa.name);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button & Action Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/madrasas"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Madrasas Directory</span>
        </Link>
        <Link to="/admin/students">
          <Button variant="outline" size="sm" icon={<GraduationCap className="w-4 h-4 text-emerald-600" />}>
            Manage Students in Portal
          </Button>
        </Link>
      </div>

      {/* Madrasa Main Hero Box */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="gold">{madrasa.level}</Badge>
              <span className="text-xs text-stone-400 font-mono">ID: {madrasa.id}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {madrasa.name}
            </h1>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>{madrasa.address}, {madrasa.district}</span>
              <span>•</span>
              <span>Established {madrasa.establishedYear || '1975'} CE</span>
            </div>
            <p className="text-stone-600 dark:text-stone-300 text-sm max-w-3xl leading-relaxed pt-2">
              {madrasa.description}
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <Button
              variant="gold"
              size="sm"
              icon={<HeartHandshake className="w-4 h-4" />}
              onClick={() => navigate('/donate')}
            >
              Sponsor a Student
            </Button>
            {linkedMosque && (
              <Link to={`/mosques/${linkedMosque.id}`}>
                <Button variant="secondary" size="sm" icon={<Building className="w-4 h-4" />} className="w-full text-xs">
                  Parent Mosque
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* 4 Stat Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 block">
              Total Students
            </span>
            <span className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">
              {madrasa.totalStudents}
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              {madrasa.maleStudents} Boys • {madrasa.femaleStudents} Girls
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">
              Huffaz Produced
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-950 dark:text-emerald-100">
              {madrasa.hifzGraduatesCount}+
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              Verified Sanads
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold text-blue-800 dark:text-blue-300 block">
              Faculty Size
            </span>
            <span className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">
              {madrasa.totalTeachers} Mu'allims
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              Head: {madrasa.headTeacher.split(' ')[0]} {madrasa.headTeacher.split(' ')[1]}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold text-stone-600 dark:text-stone-400 block">
              Session Shift
            </span>
            <span className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 block mt-1">
              {madrasa.shift}
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              7 Days / Week
            </span>
          </div>
        </div>
      </div>

      {/* Curriculum & Faculty Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Curriculum & Sample Students */}
        <div className="lg:col-span-8 space-y-8">
          {/* Standardized Subjects */}
          <Card className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <span>Standardized Curriculum Framework</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {madrasa.curriculum.map((item) => (
                <div
                  key={item}
                  className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Sample Students Enrolled at this Madrasa */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <span>Featured Students in Active Tahfeez</span>
              </h3>
              <Link to="/admin/students" className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">
                View All in Registry →
              </Link>
            </div>

            <div className="space-y-3">
              {enrolledStudents.slice(0, 4).map((student) => (
                <div
                  key={student.id}
                  className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                        {student.name}
                      </h4>
                      <div className="text-xs text-stone-500 dark:text-stone-400">
                        Age: {student.age} • Level: {student.level} • {student.tajweedRating} Tajweed
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {student.quranJuzCompleted} / 30 Juz Completed
                      </span>
                      <span className="text-[10px] text-stone-400 block">
                        Focus: Juz {student.currentJuz} ({student.currentJuzProgress}%)
                      </span>
                    </div>
                    <Link to={`/admin/students/${student.id}`}>
                      <Button variant="secondary" size="sm" className="text-xs">
                        Open Progress
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Faculty Roster */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="space-y-4">
            <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Assigned Teachers & Mu'allims</span>
            </h4>

            <div className="space-y-3">
              {facultyTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      {teacher.name}
                    </span>
                    <Badge variant="blue">{teacher.specialization}</Badge>
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">
                    Sanad: {teacher.sanad}
                  </div>
                  <div className="text-[11px] text-stone-400 flex items-center justify-between pt-1 border-t border-stone-200/60 dark:border-stone-700/60">
                    <span>Exp: {teacher.experienceYears} Years</span>
                    <span>Students: {teacher.assignedStudentsCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
