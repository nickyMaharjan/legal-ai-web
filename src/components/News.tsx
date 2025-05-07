import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Paper } from '@mui/material';

const NewsSection = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
  const legalKeywords = ['law', 'legal', 'court', 'judge', 'attorney', 'justice', 'supreme court', 'litigation', 'lawsuit', 'regulation'];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
          params: {
            country: 'us',
            apiKey: '16a2a837f9594bc0b58d4e68c33ea741', 
          },
        });

        
        const filteredArticles = response.data.articles.filter((article: any) =>
          legalKeywords.some(keyword =>
            (article.title && article.title.toLowerCase().includes(keyword)) ||
            (article.description && article.description.toLowerCase().includes(keyword))
          )
        );

        setNews(filteredArticles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to fetch news');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Paper sx={{ padding: 3, marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Legal News
      </Typography>
      {news.length === 0 ? (
        <Typography>No legal news found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {news.map((article, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{article.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{article.description}</Typography>
                  <Typography variant="body2">
                    <a href={article.url} target="_blank" rel="noopener noreferrer">Read More</a>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
};

export default NewsSection;
