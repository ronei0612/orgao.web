class DraggableController {
    constructor(element) {
        this.draggableControls = element;
        this.isDragging = false;
        this.offset = { x: 0, y: 0 };
        this.startX = 0;
        this.startY = 0;
        this.DRAG_THRESHOLD = 5;
        this.isSetup = false;

        this.onDragStart = this.onDragStart.bind(this);
        this.onDragMove = this.onDragMove.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.setupListeners();
    }

    setupStyles() {
        if (!this.isSetup) {
            const rect = this.draggableControls.getBoundingClientRect();

            this.draggableControls.style.left = `${rect.left}px`;
            this.draggableControls.style.top = `${rect.top}px`;

            this.isSetup = true;
        }
    }

    setupListeners() {
        this.draggableControls.addEventListener('mousedown', this.onDragStart);
        this.draggableControls.addEventListener('touchstart', this.onDragStart);
    }

    onDragStart(event) {
        if (!this.draggableControls.classList.contains('draggable')) {
            return;
        }

        this.isDragging = false;
        this.setupStyles();

        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;

        this.startX = clientX;
        this.startY = clientY;

        const currentLeft = parseFloat(this.draggableControls.style.left);
        const currentTop = parseFloat(this.draggableControls.style.top);

        this.offset.x = clientX - currentLeft;
        this.offset.y = clientY - currentTop;

        document.addEventListener('mousemove', this.onDragMove);
        document.addEventListener('mouseup', this.onDragEnd);
        document.addEventListener('touchmove', this.onDragMove);
        document.addEventListener('touchend', this.onDragEnd);
    }

    onDragMove(event) {
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;

        if (!this.isDragging) {
            const dx = Math.abs(clientX - this.startX);
            const dy = Math.abs(clientY - this.startY);
            if (dx > this.DRAG_THRESHOLD || dy > this.DRAG_THRESHOLD) {
                this.isDragging = true;
                this.draggableControls.classList.add('dragging');
            } else {
                return;
            }
        }

        event.preventDefault();

        let newX = clientX - this.offset.x;
        let newY = clientY - this.offset.y;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const elementWidth = this.draggableControls.offsetWidth;
        const elementHeight = this.draggableControls.offsetHeight;

        newX = Math.max(0, Math.min(newX, viewportWidth - elementWidth));
        newY = Math.max(0, Math.min(newY, viewportHeight - elementHeight));

        this.draggableControls.style.left = `${newX}px`;
        this.draggableControls.style.top = `${newY}px`;
    }

    onDragEnd(event) {
        document.removeEventListener('mousemove', this.onDragMove);
        document.removeEventListener('mouseup', this.onDragEnd);
        document.removeEventListener('touchmove', this.onDragMove);
        document.removeEventListener('touchend', this.onDragEnd);

        if (this.isDragging) {
            this.draggableControls.classList.remove('dragging');
        }
        this.isDragging = false;
    }
}