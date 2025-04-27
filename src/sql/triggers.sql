DELIMITER //

CREATE TRIGGER set_seats_on_schedule_insert
BEFORE INSERT ON schedules
FOR EACH ROW
BEGIN
    DECLARE eco_max_val INT;
    DECLARE bus_max_val INT;
    DECLARE vip_max_val INT;

    SELECT eco_max, bus_max, vip_max INTO eco_max_val, bus_max_val, vip_max_val
    FROM trains
    WHERE id = NEW.train_id;

    SET NEW.eco_left = eco_max_val;
    SET NEW.bus_left = bus_max_val;
    SET NEW.vip_left = vip_max_val;
END;
//

DELIMITER ;

DELIMITER //

CREATE TRIGGER reduce_seats_on_ticket
BEFORE INSERT ON tickets
FOR EACH ROW
BEGIN
    IF NEW.class = 'economy' THEN
        UPDATE schedules
        SET eco_left = eco_left - 1
        WHERE id = NEW.schedule_id;
        
    ELSEIF NEW.class = 'business' THEN
        UPDATE schedules
        SET bus_left = bus_left - 1
        WHERE id = NEW.schedule_id;

    ELSEIF NEW.class = 'vip' THEN
        UPDATE schedules
        SET vip_left = vip_left - 1
        WHERE id = NEW.schedule_id;
    END IF;
END;
//

DELIMITER ;

DELIMITER //

CREATE TRIGGER increase_seats_on_ticket_cancel_or_complete
AFTER UPDATE ON tickets
FOR EACH ROW
BEGIN
    IF (NEW.status = 'Cancelled' OR NEW.status = 'Completed')
       AND OLD.status = 'Booked' THEN

        IF NEW.class = 'economy' THEN
            UPDATE schedules
            SET eco_left = eco_left + 1
            WHERE id = NEW.schedule_id;

        ELSEIF NEW.class = 'business' THEN
            UPDATE schedules
            SET bus_left = bus_left + 1
            WHERE id = NEW.schedule_id;

        ELSEIF NEW.class = 'vip' THEN
            UPDATE schedules
            SET vip_left = vip_left + 1
            WHERE id = NEW.schedule_id;
        END IF;
    END IF;
END;
//

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UpdateTicketStatuses()
BEGIN
    UPDATE tickets t
    JOIN schedules s ON t.schedule_id = s.id
    SET t.status = 'Completed'
    WHERE s.arrival_time < NOW()
      AND t.status = 'Booked';

    UPDATE tickets t
    JOIN schedules s ON t.schedule_id = s.id
    SET t.status = 'Cancelled',
        t.cancelled_at = NOW()
    WHERE s.status = 'Cancelled'
      AND t.status = 'Booked';
END;
//

DELIMITER ;
