"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MessageSquare, Search, CheckCircle, Clock } from "lucide-react";

export default function AdminQueriesPage() {
  const [queries, setQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_queries')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) {
      setQueries(data);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    await supabase.from('contact_queries').update({ status }).eq('id', id);
    fetchQueries();
  };

  const filteredQueries = queries.filter(q => 
    q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl text-heading mb-1">Contact Queries</h1>
          <p className="text-sm text-foreground/70">View messages submitted via the contact form.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-background/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-surface border border-border rounded-md focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-border">
          {loading ? (
            <div className="p-8 text-center text-sm text-foreground/50">Loading queries...</div>
          ) : filteredQueries.length === 0 ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center justify-center text-foreground/50">
                <MessageSquare className="w-12 h-12 mb-3 stroke-[1]" />
                <p>No contact queries found.</p>
              </div>
            </div>
          ) : (
            filteredQueries.map((query) => (
              <div key={query.id} className="p-6 hover:bg-muted/30 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="font-serif text-lg text-heading font-medium">{query.name}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-foreground/70">
                      <a href={`mailto:${query.email}`} className="hover:text-primary transition-colors">{query.email}</a>
                      {query.phone && <span>{query.phone}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      query.status === 'Resolved' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    }`}>
                      {query.status === 'Resolved' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                      {query.status || 'Pending'}
                    </span>
                  </div>
                </div>
                
                <div className="bg-background rounded-md p-4 text-sm text-foreground/80 whitespace-pre-wrap border border-border/50">
                  {query.message}
                </div>
                
                <div className="mt-4 flex justify-between items-center text-xs text-foreground/50">
                  <span>{new Date(query.created_at).toLocaleString()}</span>
                  
                  {query.status !== 'Resolved' && (
                    <button 
                      onClick={() => handleUpdateStatus(query.id, 'Resolved')}
                      className="px-4 py-1.5 bg-primary/10 text-primary font-bold uppercase tracking-wider rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      Mark as Resolved
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
