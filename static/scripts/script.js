const difficulty_element = document.getElementById("difficulty_id");

var easy_settings = {
    max_misses: 3,
    points_required_to_win: 3,
    board_size: {
        x: 3,
        y: 3
    },
}

var medium_settings = {
    max_misses: 6,
    points_required_to_win: 6,
    board_size: {
        x: 6,
        y: 6
    },
}

var hard_settings = {
    max_misses: 9,
    points_required_to_win: 9,
    board_size: {
        x: 9,
        y: 9
    },
}

function difficulty_to_settings(difficulty) {
    switch (difficulty) {
        case "Easy": 
            return easy_settings;
        case "Medium":
            return medium_settings;
        case "Hard":
            return hard_settings;
        default:
            return easy_settings;
    }
}

const game = {
    losing_icons: ['💣', '🍄', '☢️', '🎈'],
    winning_icon: '👑',
    base_icon: '❔',
    state: {
        misses: 0,
        points: 0,
        game_id: 0,
        board_data: 0
    },
    settings: {
        max_misses: 5,
        points_required_to_win: 3,
        board_size: {
            x: 3,
            y: 3
        }
    },

    get_random_losing_icon() {
        return this.losing_icons[Math.floor(Math.random() * this.losing_icons.length)];
    },

    start() {
        this.state.game_id++;
        this.settings = difficulty_to_settings(difficulty_element.value);
        this.create_board();

        this.update_info_bar();
    },
    
    reset() {
        this.state.misses = 0;
        this.state.points = 0;
        this.settings = difficulty_to_settings(difficulty_element.value);

        if (this.state.game_id > 0) {
            this.remove_board();
        }

        this.create_board();

        this.update_info_bar();
    },

    update_info_bar() {
        var info_element = document.getElementById("info");
        info_element.innerHTML = "Points: " + this.state.points + "<br>Misses Left: " + (this.settings.max_misses - this.state.misses);
        var color = getComputedStyle(info_element).getPropertyValue('--color-font');
        info_element.style.color = color;
        info_element.style.textShadow = "none";
    },

    on_reveal(element) {
        if (element.innerHTML != game.base_icon) {
            return;
        }
    
        if (game.state.misses >= game.settings.max_misses) {
            return;
        }
    
        if (game.state.points >= game.settings.points_required_to_win) {
            return;
        }

        const x_index = element.closest('tr').rowIndex;
        const y_index = element.cellIndex;
    
        if (this.state.board_data[x_index][y_index] === this.winning_icon) {
            element.innerHTML = this.winning_icon;
            element.style.border = '1px solid #d6ad60';
            game.state.points++;
        }
        else {
            element.innerHTML = game.get_random_losing_icon();
            game.state.misses++;
        }

        if (game.state.misses >= game.settings.max_misses && game.state.points < game.settings.points_required_to_win) {
            var info_element = document.getElementById("info");
            info_element.innerHTML = "You lost";
            info_element.style.color = "#ff0000";
            info_element.style.textShadow = "1px 1px 1px #0C0C0C64";
            return;
        }
    
        if (game.state.points >= this.settings.points_required_to_win) {
            var info_element = document.getElementById("info");
            info_element.innerHTML = "You Won";
            info_element.style.color = "#b0ff73";
            info_element.style.textShadow = "1px 1px 1px #0C0C0C64";
            return;
        }

        this.update_info_bar();
    },

    create_board() {
        const size_w = this.settings.board_size.x;
        const size_h = this.settings.board_size.y;

        this.state.board_data = Array.from(Array(size_w), () => new Array(size_h))

        var table = document.createElement('table');
        table.id = 'table_id';

        var crowns_generated = 0;
        while (crowns_generated < this.settings.points_required_to_win) {
            var crown_x = Math.floor(Math.random() * this.settings.board_size.x);
            var crown_y = Math.floor(Math.random() * this.settings.board_size.y);

            if (this.state.board_data[crown_x][crown_y] != this.winning_icon) {
                this.state.board_data[crown_x][crown_y] = this.winning_icon;
                crowns_generated++; 
            }
        }

        for (var i = 0; i < size_w; i++) {
            var tr = document.createElement('tr');
            for (var j = 0; j < size_h; j++) {
                var td = document.createElement('td');                
                td.textContent = game.base_icon;
                td.setAttribute( "onClick", "javascript: game.on_reveal(this);" );
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    
        var section = document.getElementById("board");
        if (section) {
            section.appendChild(table);
        } else {
            console.log("Couldnt find board section element");
        }
    },

    remove_board() {
        var table = document.getElementById('table_id');
        if (table) {
            table.remove();
        } else {
            console.log("Couldn't find table element, or It's already removed");
        }
    }
}

function start_handler(element) {
    element.style.display = 'none';
    game.start();

    var restart_button = document.getElementById("restart_button");
    if (restart_button) {
        restart_button.style.display = 'inline-block';
    }
    else {
        console.log("Couldn't find restart button element")
    }
}

function reset_handler(element) {
    game.reset();
}

// no idea, found it online d-_-b
function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
    if (localStorageTheme !== null) {
      return localStorageTheme;
    }
  
    if (systemSettingDark.matches) {
      return "dark";
    }
  
    return "light";
}

function updateButton({ buttonEl, isDark }) {
    buttonEl.innerText = isDark ? "Light Mode ☀️" : "Dark Mode 🌙";
}

function updateThemeOnHtmlEl({ theme }) {
    document.querySelector("html").setAttribute("data-theme", theme);
}

const button = document.getElementById("toggle_dark_theme");
const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
updateThemeOnHtmlEl({ theme: currentThemeSetting });

button.addEventListener("click", (event) => {
    const newTheme = currentThemeSetting === "dark" ? "light" : "dark";
  
    localStorage.setItem("theme", newTheme);
    updateButton({ buttonEl: button, isDark: newTheme === "dark" });
    updateThemeOnHtmlEl({ theme: newTheme });
  
    currentThemeSetting = newTheme;
}); 