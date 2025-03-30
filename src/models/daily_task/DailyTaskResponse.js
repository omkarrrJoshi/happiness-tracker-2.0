const { convertToIST } = require("../../utils/utils");

class DailyTaskResponse {
  constructor(taskRef, taskProgress) {
    this.daily_task_ref_id = taskRef.id;
    this.daily_task_progress_id = taskProgress.id;
    this.name = taskRef.name;
    this.pillar = taskRef.pillar;
    this.type = taskRef.type;
    this.link = taskRef.link;
    this.description = taskRef.description;
    this.image_url = taskRef.image_url;
    this.start_date = convertToIST(taskRef.start_date);
    this.end_date = taskRef.end_date ? convertToIST(taskRef.end_date) : null;
    this.target = taskRef.target;
    this.daily_progress = taskProgress.daily_progress;
    this.daily_target = taskProgress.daily_target;
    this.date = convertToIST(taskProgress.date);
  }
}

module.exports = DailyTaskResponse;