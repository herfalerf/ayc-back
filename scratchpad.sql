-- returns table with videos list and their corresponding tags

SELECT videos.id, videos.name, tags.id AS tags_id FROM videos JOIN videos_tags ON videos.id = videos_tags.video_id JOIN tags ON videos_tags.tag_id = tags.id;  


-- returns tabel with videos that correspond to a certain tag.
SELECT videos.id, videos.name, tags.name AS tag_name FROM videos JOIN videos_tags ON videos.id = videos_tags.video_id JOIN tags ON videos_tags.tag_id = tags.id WHERE tags.name='funny';  