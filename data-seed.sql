
INSERT INTO team (name, bio, img)
VALUES ('Steve Stevenson',
        'Big man with a plan.',
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'),
        ('Rachel Rachelson',
         'Many years of experience doing things',
         'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'),
         ('Timmy Jimmy',
          'Has two first names, knows it',
          'https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500');

INSERT INTO videos (name, description, link)
VALUES ('Costa Rica',
        'Costa Rica in 4k',
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/LXb3EKWsInQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'),
        ('Another World',
         'Sony 4k Demo: Another World',
         '<iframe width="560" height="315" src="https://www.youtube.com/embed/xcJtL7QggTI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'),
        ('Unbelievable Beauty',
         '4K Video (Ultra HD) Unbelieveable Beauty',
         '<iframe width="560" height="315" src="https://www.youtube.com/embed/K1QICrgxTjA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'),
        ('Wild Animals',
         'Ultimate Wild Animals Collection in 8K ULTRA HD',
         '<iframe width="560" height="315" src="https://www.youtube.com/embed/Zv11L-ZfrSg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');

INSERT INTO tags (name) VALUES ('main'), ('funny'), ('serious');

INSERT INTO customers (name, email, phone, company)
VALUES ('John Smith',
        'johnsmith@email.com',
        '111-111-1111',
        'Acme Corp'),
        ('Tim Jones',
         'timjones@testmail.com',
         '222-222-2222',
         'Initech'),
         ('Lew Alexander',
          'lew_alexander@loogle.com',
          '333-333-3333',
          'Loogle');

INSERT INTO videos_tags (video_id, tag_id)
VALUES ('1', '1'),
       ('2', '3'),
       ('2', '2'),
       ('3', '3'),
       ('4', '2');

INSERT INTO admins (username, password)
VALUES ('super', '$2b$12$m/bLkUAj6w4l7wj0vL7PY.WcyOVXxXoF42oVPTGPPUpKFfLBO.1D6');