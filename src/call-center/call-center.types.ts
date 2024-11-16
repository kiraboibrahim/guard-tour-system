enum CallStatusType {
  COMPLETED = 'completed',
  BUSY = 'busy',
  CANCELED = 'canceled',
  FAILED = 'failed',
  NO_ANSWER = 'no-answer',
}

export class CallStatus {
  constructor(private status: string) {}

  isCompleted() {
    return this.status === CallStatusType.COMPLETED;
  }

  isBusy() {
    return this.status === CallStatusType.BUSY;
  }

  isCanceled() {
    return this.status === CallStatusType.CANCELED;
  }
  isFailed() {
    return this.status === CallStatusType.FAILED;
  }
  isNotAnswered() {
    return this.status === CallStatusType.NO_ANSWER;
  }

  static isEndedStatus(status: string) {
    return [
      CallStatusType.COMPLETED,
      CallStatusType.BUSY,
      CallStatusType.CANCELED,
      CallStatusType.FAILED,
      CallStatusType.NO_ANSWER,
    ].includes(status as CallStatusType);
  }
}
