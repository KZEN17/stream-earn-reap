import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ExternalLink, 
  Download,
  Play,
  TrendingUp,
  Eye,
  DollarSign
} from "lucide-react";

const Calendar = () => {
  const upcomingLaunches = [
    {
      id: 1,
      title: "$MOON Token Launch Stream",
      dateTimeISO: "2024-12-20T19:00:00Z",
      streamLink: "https://twitch.tv/moonmaster",
      tokenLink: "https://pump.fun/moon",
      streamer: "@moonmaster",
      description: "Join us for the biggest token launch of the month! Interactive stream with live trading.",
      status: "upcoming"
    },
    {
      id: 2,
      title: "$ROCKET Launch Party",
      dateTimeISO: "2024-12-22T23:00:00Z", 
      streamLink: "https://twitch.tv/rocketman",
      tokenLink: "https://pump.fun/rocket",
      streamer: "@rocketman",
      description: "High-energy launch event with giveaways and surprise guests.",
      status: "upcoming"
    },
    {
      id: 3,
      title: "$DIAMOND Holiday Special",
      dateTimeISO: "2024-12-25T01:00:00Z",
      streamLink: "https://twitch.tv/cryptoqueen", 
      tokenLink: "https://pump.fun/diamond",
      streamer: "@cryptoqueen",
      description: "Christmas special launch with exclusive holiday rewards.",
      status: "upcoming"
    }
  ];

  const pastLaunches = [
    {
      id: 1,
      title: "$PUMP Launch Event",
      date: "Dec 15, 2024",
      clipsCount: 24,
      totalViews: 450000,
      feesGenerated: 1250,
      streamer: "@pumpmaster"
    },
    {
      id: 2,
      title: "$HODL Stream Marathon", 
      date: "Dec 12, 2024",
      clipsCount: 18,
      totalViews: 320000,
      feesGenerated: 980,
      streamer: "@hodlking"
    },
    {
      id: 3,
      title: "$MEME Token Reveal",
      date: "Dec 10, 2024", 
      clipsCount: 31,
      totalViews: 580000,
      feesGenerated: 1750,
      streamer: "@memelord"
    }
  ];

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
      })
    };
  };

  const generateICS = (launch: typeof upcomingLaunches[0]) => {
    const startDate = new Date(launch.dateTimeISO);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
    
    const formatDateForICS = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CLIP//Launch Calendar//EN
BEGIN:VEVENT
UID:${launch.id}@clip.app
DTSTAMP:${formatDateForICS(new Date())}
DTSTART:${formatDateForICS(startDate)}
DTEND:${formatDateForICS(endDate)}
SUMMARY:${launch.title}
DESCRIPTION:${launch.description}\\n\\nStream: ${launch.streamLink}\\nToken: ${launch.tokenLink}
LOCATION:${launch.streamLink}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${launch.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-gradient-rainbow">Launch Calendar</h1>
          <p className="text-xl text-muted-foreground">
            Never miss a pump.fun launch event
          </p>
        </div>

        {/* Upcoming Launches */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold flex items-center space-x-2">
            <CalendarIcon className="w-8 h-8 text-primary" />
            <span>Upcoming Launches</span>
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {upcomingLaunches.map((launch) => {
              const { date, time } = formatDateTime(launch.dateTimeISO);
              return (
                <Card key={launch.id} className="hover-lift shadow-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <Badge variant="secondary" className="w-fit">
                          {launch.status}
                        </Badge>
                        <CardTitle className="text-xl">{launch.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{launch.streamer}</p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium">{date}</div>
                        <div className="text-muted-foreground flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {time}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{launch.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="hero" 
                        size="sm"
                        onClick={() => generateICS(launch)}
                        className="flex items-center space-x-1"
                      >
                        <Download className="w-4 h-4" />
                        <span>Set Reminder</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                      >
                        <a href={launch.streamLink} target="_blank" rel="noopener noreferrer">
                          <Play className="w-4 h-4 mr-1" />
                          View Stream
                        </a>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                      >
                        <a href={launch.tokenLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Token Page
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Past Launches */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold flex items-center space-x-2">
            <TrendingUp className="w-8 h-8 text-secondary" />
            <span>Past Launches</span>
          </h2>
          
          <div className="grid gap-6">
            {pastLaunches.map((launch) => (
              <Card key={launch.id} className="hover-lift shadow-card">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{launch.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{launch.date}</span>
                        <span>•</span>
                        <span>{launch.streamer}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-primary">{launch.clipsCount}</div>
                        <div className="text-sm text-muted-foreground">Clips</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-secondary flex items-center justify-center">
                          <Eye className="w-5 h-5 mr-1" />
                          {(launch.totalViews / 1000).toFixed(0)}K
                        </div>
                        <div className="text-sm text-muted-foreground">Views</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-accent flex items-center justify-center">
                          <DollarSign className="w-5 h-5 mr-1" />
                          {launch.feesGenerated}
                        </div>
                        <div className="text-sm text-muted-foreground">Fees</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl p-8">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Want to Launch Your Token?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get featured on our launch calendar and tap into our clipper network for maximum exposure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                Submit Launch Request
              </Button>
              <Button variant="outline" size="lg">
                View Launch Guide
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Calendar;