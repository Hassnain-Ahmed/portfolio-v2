'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const SEPARATION = 150;
		const AMOUNTX = 40;
		const AMOUNTY = 60;

		const width = () => container.clientWidth || window.innerWidth;
		const height = () => container.clientHeight || window.innerHeight;

		const scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0xfafafa, 2000, 10000);

		const camera = new THREE.PerspectiveCamera(60, width() / height(), 1, 10000);
		camera.position.set(0, 355, 1220);

		const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width(), height());
		renderer.setClearColor(0xfafafa, 0);

		container.appendChild(renderer.domElement);

		const geometry = new THREE.BufferGeometry();
		const positions: number[] = [];
		const colors: number[] = [];

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				positions.push(
					ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
					0,
					iy * SEPARATION - (AMOUNTY * SEPARATION) / 2,
				);
				colors.push(0, 0, 0);
			}
		}

		geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		const material = new THREE.PointsMaterial({
			size: 8,
			vertexColors: true,
			transparent: true,
			opacity: 0.8,
			sizeAttenuation: true,
		});

		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let count = 0;
		let animationId = 0;

		const animate = () => {
			animationId = requestAnimationFrame(animate);

			const posAttr = geometry.attributes.position;
			const arr = posAttr.array as Float32Array;

			let i = 0;
			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					arr[i * 3 + 1] =
						Math.sin((ix + count) * 0.3) * 50 +
						Math.sin((iy + count) * 0.5) * 50;
					i++;
				}
			}

			posAttr.needsUpdate = true;
			renderer.render(scene, camera);
			count += 0.1;
		};

		const handleResize = () => {
			camera.aspect = width() / height();
			camera.updateProjectionMatrix();
			renderer.setSize(width(), height());
		};

		window.addEventListener('resize', handleResize);
		animate();

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener('resize', handleResize);

			scene.traverse((object: THREE.Object3D) => {
				if (object instanceof THREE.Points) {
					object.geometry.dispose();
					if (Array.isArray(object.material)) {
						object.material.forEach((m: THREE.Material) => m.dispose());
					} else {
						object.material.dispose();
					}
				}
			});

			renderer.dispose();
			if (container.contains(renderer.domElement)) {
				container.removeChild(renderer.domElement);
			}
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className={cn('pointer-events-none absolute inset-0', className)}
			{...props}
		/>
	);
}
