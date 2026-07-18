import React from 'react';
import { TopBar } from '../components/TopBar';
import { Header } from '../components/Header';
import { NavBar } from '../components/NavBar';
import { User, Briefcase, GraduationCap, MapPin, Award, CheckCircle } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <TopBar />
      <Header />
      <NavBar />
      
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          </div>
          
          <div className="px-8 pb-8 relative">
            {/* Profile Picture */}
            <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 absolute -top-16 shadow-lg flex items-center justify-center overflow-hidden">
              <User size={64} className="text-slate-400" />
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end pt-4 gap-3">
              <button className="px-6 py-2 border border-slate-300 rounded-full font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Edit Profile
              </button>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium shadow-md transition-colors flex items-center gap-2">
                <CheckCircle size={18} /> Complete Profile
              </button>
            </div>
            
            {/* User Info */}
            <div className="mt-8">
              <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                John Doe
                <CheckCircle size={20} className="text-green-500" />
              </h1>
              <p className="text-lg text-slate-600 mt-1">Aspiring Product Manager</p>
              
              <div className="flex flex-wrap gap-6 mt-4 text-sm font-medium text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-slate-400" />
                  New Delhi, India
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap size={18} className="text-slate-400" />
                  B.Tech, Computer Science
                </div>
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-slate-400" />
                  85% Match for Internships
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">About Me</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Highly motivated computer science graduate with a passion for building scalable web applications. Eager to apply my technical skills and learn from industry leaders through a PM Internship. I have experience with React, Node.js, and Python.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Briefcase size={20} className="text-blue-600" /> Experience
                  </h3>
                  <div className="space-y-4">
                    <div className="border-l-2 border-blue-500 pl-4">
                      <h4 className="font-bold text-slate-800">Software Developer Intern</h4>
                      <p className="text-sm text-slate-500">TechCorp Solutions | Jan 2026 - Present</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 shadow-sm">
                  <h3 className="text-lg font-bold text-orange-800 mb-2">Application Status</h3>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm mb-3 border border-orange-200">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">Microsoft India</p>
                      <p className="text-xs text-orange-600 font-medium">Under Review</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">Google India</p>
                      <p className="text-xs text-slate-500 font-medium">Applied</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
};
