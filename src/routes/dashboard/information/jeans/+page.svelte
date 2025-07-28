<script lang="ts">
	const names = [
		{ name: "Mariella Jeans", color: "gold"},
		{ name: "Paolo", color: "crimson", description: "my goat btw^ not designer bias" },
		{ name: "Bea", color: "crimson", description: "upper class citizen" },
		{ name: "Gidoen", color: "dodgerblue" },
		{ name: "Roan", color: "dodgerblue", description: "lowest class citizen" },
		{ name: "Mika", color: "dodgerblue" },
		{ name: "JP Helbling", color: "limegreen" },
		{ name: "m00nlight", color: "limegreen" },
		{ name: "Thara", color: "purple" }
	];

	function random(min: number, max: number) {
		return Math.random() * (max - min) + min;
	}

	const randomized = names.map(item => {
		return {
			...item,
			top: random(0, 80) + 'vh',
			left: random(0, 90) + 'vw',
			duration: random(10, 30) + 's',
			delay: random(0, 10) + 's',
			animationDirection: Math.random() > 0.5 ? 'alternate' : 'alternate-reverse'
		};
	});
</script>

<div class="name-overlay background-banner">
	{#each randomized as item}
		<div
			class="floating-name"
			style="
			top: {item.top};
			left: {item.left};
			color: {item.color};
			animation-duration: {item.duration};
			animation-delay: {item.delay};
			animation-direction: {item.animationDirection};
		"
		>
			{item.name}
			{#if item.description}
				<div class="subtext" style="color: {item.color}">{item.description}</div>
			{/if}
		</div>
	{/each}
</div>




<style>
    .background-banner {
        background-color: #2b2d31;
        background-image: url('/img/Initial%20Design.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        width: 100vw;
        height: 100vh;
    }

    .name-overlay {
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    .floating-name {
        position: absolute;
        font-size: 6rem;
        font-weight: bold;
        color: white;
        text-shadow: 1px 1px 4px black;
        animation: floatAround infinite ease-in-out;
    }

    .subtext {
        font-size: 2rem;
        font-weight: normal;
        opacity: 0.8;
        text-shadow: 1px 1px 3px black;
        line-height: 1.2;
    }

    /* Keyframes for floating motion */
    @keyframes floatAround {
        0% {
            transform: translate(0px, 0px) rotate(0deg);
        }
        50% {
            transform: translate(30px, -20px) rotate(5deg);
        }
        100% {
            transform: translate(-20px, 30px) rotate(-5deg);
        }
    }
</style>