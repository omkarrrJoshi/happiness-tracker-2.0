class DailyTaskResponse {
  constructor(data) {
    this.user_id = data.user_id;
    this.name = data.name;
    this.pillar = data.pillar;
    this.type = data.type;
    this.link = data.link;
    this.description = data.description;
    this.start_date = data.start_date;
    this.end_date = data.end_date;
    this.target = data.target;
    this.daily_task_ref_id = data.daily_task_ref_id || data.id;

    this.daily_progress = data.daily_progress;
    this.daily_target = data.daily_target;
    this.date = data.date;
    this.daily_task_progress_id = data.daily_task_progress_id || data.progress_id;
  }
}

module.exports = DailyTaskResponse;