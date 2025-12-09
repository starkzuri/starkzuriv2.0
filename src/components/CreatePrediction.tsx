import { useState } from 'react';
import { Upload, Image, Video, Music, Calendar, Tag } from 'lucide-react';

export function CreatePrediction() {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio'>('image');
  const [endDate, setEndDate] = useState('');

  const categories = ['Crypto', 'Tech', 'Sports', 'Politics', 'Entertainment', 'Science', 'Space'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Create prediction:', { question, category, mediaType, endDate });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-6">
        <h2 className="text-foreground mb-6">Create Prediction</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Media Upload */}
          <div className="space-y-3">
            <label className="text-foreground">Upload Media</label>
            <div className="border-2 border-dashed border-[#1F87FC]/30 rounded-lg p-8 text-center hover:border-[#1F87FC]/60 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-[#1F87FC] mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">Image, Video, or Audio</p>
            </div>

            {/* Media Type Selector */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMediaType('image')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
                  mediaType === 'image'
                    ? 'bg-[#1F87FC]/20 border-[#1F87FC] text-[#1F87FC]'
                    : 'border-border text-muted-foreground hover:border-[#1F87FC]/40'
                }`}
              >
                <Image className="w-4 h-4" />
                <span>Image</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
                  mediaType === 'video'
                    ? 'bg-[#1F87FC]/20 border-[#1F87FC] text-[#1F87FC]'
                    : 'border-border text-muted-foreground hover:border-[#1F87FC]/40'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Video</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaType('audio')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
                  mediaType === 'audio'
                    ? 'bg-[#1F87FC]/20 border-[#1F87FC] text-[#1F87FC]'
                    : 'border-border text-muted-foreground hover:border-[#1F87FC]/40'
                }`}
              >
                <Music className="w-4 h-4" />
                <span>Audio</span>
              </button>
            </div>
          </div>

          {/* Prediction Question */}
          <div className="space-y-3">
            <label htmlFor="question" className="text-foreground">Prediction Question</label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What will happen? Make it clear and specific..."
              className="w-full h-32 bg-[#1a1a24] border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#1F87FC] focus:ring-1 focus:ring-[#1F87FC] transition-colors resize-none"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-3">
            <label className="text-foreground flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    category === cat
                      ? 'bg-[#1F87FC]/20 border-[#1F87FC] text-[#1F87FC]'
                      : 'border-border text-muted-foreground hover:border-[#1F87FC]/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-3">
            <label htmlFor="endDate" className="text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              End Date
            </label>
            <input
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[#1a1a24] border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-[#1F87FC] focus:ring-1 focus:ring-[#1F87FC] transition-colors"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#1F87FC] text-white py-4 rounded-lg hover:bg-[#1F87FC]/90 transition-all hover:shadow-[0_0_30px_rgba(31,135,252,0.5)]"
          >
            Publish Prediction
          </button>
        </form>
      </div>
    </div>
  );
}
