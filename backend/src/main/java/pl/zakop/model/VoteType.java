package pl.zakop.model;

public enum VoteType {
    WYKOP(1),
    ZAKOP(-1);

    private final int value;

    VoteType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
