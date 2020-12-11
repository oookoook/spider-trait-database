UPDATE data LEFT JOIN location ON data.location_id = location.id SET 
data.locality = location.locality,
data.altitude = location.altitude,
data.habitat = location.habitat,
data.microhabitat = location.microhabitat,
data.country_id = location.country_id WHERE data.location_id IS NOT NULL;

UPDATE data LEFT JOIN location ON data.location_id = location.id SET
data.location_id = NULL WHERE location.lat IS NULL;

UPDATE import SET location_id = NULL;

DELETE location 
FROM location
        LEFT JOIN
    data ON location.id = data.location_id 
WHERE
    data.location_id IS NULL;