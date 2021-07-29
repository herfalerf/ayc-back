-- returns table with videos list and their corresponding tags

SELECT videos.id, videos.name, tags.id AS tags_id FROM videos JOIN videos_tags ON videos.id = videos_tags.video_id JOIN tags ON videos_tags.tag_id = tags.id;  


-- returns tabel with videos that correspond to a certain tag.
SELECT videos.id, videos.name, videos.link, tags.name AS tag_name FROM videos JOIN videos_tags ON videos.id = videos_tags.video_id JOIN tags ON videos_tags.tag_id = tags.id WHERE tags.name='funny';  

SELECT vt.tag_id, tags.name AS tag_name
FROM videos_tags AS vt
JOIN tags ON vt.tag_id = tags.id
WHERE vt.video_id = '1';

SELECT videos.id, videos.name, videos.link, tags.name as tag_name FROM 