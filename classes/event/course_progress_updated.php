<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Local Course Progress Manager Plugin Events.
 *
 * @package     local_edwiserreports
 * @category    admin
 * @copyright   2019 wisdmlabs <support@wisdmlabs.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace local_edwiserreports\event;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . '/classes/event/base.php');

/**
 * Course completion event for course progress manager
 */
class course_progress_updated extends \core\event\base {

    /**
     * Return localised event name.
     *
     * @return string
     */
    public static function get_name() {
        return get_string('courseprogessupdated', 'local_edwiserreports');
    }

    /**
     * Return localised event name.
     *
     * @return string
     */
    protected function init() {
        $this->data['crud'] = 'u';
        $this->data['edulevel'] = self::LEVEL_PARTICIPATING;
        $this->data['objecttable'] = 'edwreports_course_progress';
    }
}
