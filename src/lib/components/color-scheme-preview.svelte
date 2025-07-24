<div class="color-scheme-preview-container">
    <h3>Vorschau:</h3>
    <div class="color-scheme-preview">
        <div class="color-scheme-preview-item primary-button"></div>
        <div class="color-scheme-preview-item secondary-button"></div>
        <div class="color-scheme-preview-item error-button"></div>
    </div>
</div>

<style>
    h3 {
        text-align: center;
    }

    .color-scheme-preview-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 50px;
    }

    .color-scheme-preview {
        display: flex;
        flex-direction: row;
    }

    .color-scheme-preview-item  {
        aspect-ratio: 1 / 1;
        border-radius: var(--button-border-radius);
        flex-grow: 1;
    }
</style>
